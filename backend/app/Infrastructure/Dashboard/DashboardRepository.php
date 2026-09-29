<?php

namespace App\Infrastructure\Dashboard;

use App\Application\Dashboard\Ports\DashboardRepositoryInterface;
use App\Models\Achat;
use App\Models\Categorie;
use App\Models\Caisse;
use App\Models\Client;
use App\Models\Facture;
use App\Models\Lot;
use App\Models\Produit;
use App\Models\Reglement;
use App\Models\Vente;
use App\Models\VenteLigne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardRepository implements DashboardRepositoryInterface
{
    /**
     * Periodes acceptees par le tableau de bord.
     *
     * @var array<int, int>
     */
    private const PERIODES = [7, 30, 90, 365];

    public function obtenir(int $jours = 30): array
    {
        $jours = in_array($jours, self::PERIODES, true) ? $jours : 30;

        $debut = now()->subDays($jours - 1)->startOfDay();
        $fin = now()->endOfDay();
        $debutPrecedent = $debut->copy()->subDays($jours);
        $debutJour = now()->startOfDay();
        $finJour = now()->endOfDay();

        $ventesJour = $this->ventesConfirmees($debutJour, $finJour);

        return [
            'periode' => $jours,
            'date_generation' => now()->toIso8601String(),

            // ── Compteurs historiques (conservés pour compatibilité) ──
            'total_produits' => Produit::where('actif', true)->count(),
            'ventes_jour' => $ventesJour->count(),
            'chiffre_affaires_jour' => (float) $ventesJour->sum('montant_total'),
            'stocks_faibles' => $this->produitsStockFaible()->count(),
            'ruptures' => $this->produitsEnRupture()->count(),
            'peremptions_proches' => $this->lotsPeremptionProche(30)->count(),
            'factures_impayees' => Facture::whereIn(
                'statut',
                ['impayee', 'partiellement_payee']
            )->count(),

            // ── KPIs de la periode selectionnee ──
            'kpis' => $this->kpis($debut, $fin, $debutPrecedent, $finJour),

            // ── Series pour les graphiques ──
            'evolution_ca' => $this->evolutionChiffreAffaires($debut, $fin, $jours),
            'repartition_ventes' => $this->repartitionVentesParJourSemaine($debut, $fin),
            'top_produits' => $this->topProduits($debut, $fin),
            'repartition_categories' => $this->repartitionCategories($debut, $fin),
            'repartition_statuts' => $this->repartitionParStatut($debut, $fin),

            // ── Blocs operationnels ──
            'alertes' => $this->alertes(),
            'caisse' => $this->caisseOuverte(),
            'top_peremptions' => $this->topLotsPeremption(30),
            'creances' => $this->creances(),
            'dernieres_ventes' => $this->dernieresVentes(),
            'valorisation_stock' => $this->valorisationStock(),
            'approvisionnement' => $this->approvisionnement(),
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Helpers de requetes
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Vente>
     */
    private function ventesConfirmees(Carbon $debut, Carbon $fin)
    {
        return Vente::where('statut', 'confirmee')
            ->whereBetween('date_vente', [
                $debut->toDateString(),
                $fin->toDateString(),
            ])
            ->get();
    }

    /**
     * Produits dont le stock total est positif mais inferieur ou egal au minimum.
     */
    private function produitsStockFaible()
    {
        return Produit::where('actif', true)
            ->whereHas(
                'lots',
                fn ($q) => $q->where('quantite', '>', 0)
            )
            ->get()
            ->filter(function (Produit $produit) {
                $quantite = (float) Lot::where('produit_id', $produit->id)->sum('quantite');

                return $quantite > 0 && $quantite <= (float) $produit->stock_minimum;
            })
            ->values();
    }

    /**
     * Produits totalement epuises.
     */
    private function produitsEnRupture()
    {
        return Produit::where('actif', true)
            ->get()
            ->filter(function (Produit $produit) {
                return (float) Lot::where('produit_id', $produit->id)->sum('quantite') <= 0;
            })
            ->values();
    }

    /**
     * Lots encore en stock dont la peremption tombe dans la fenetre donnee.
     */
    private function lotsPeremptionProche(int $jours)
    {
        return Lot::with('produit')
            ->where('quantite', '>', 0)
            ->whereDate(
                'date_peremption',
                '<=',
                now()->addDays($jours)->toDateString()
            )
            ->orderBy('date_peremption')
            ->get();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  KPIs
    // ─────────────────────────────────────────────────────────────────────────

    private function kpis(Carbon $debut, Carbon $fin, Carbon $debutPrecedent, Carbon $finJour): array
    {
        $ventes = $this->ventesConfirmees($debut, $fin);
        $ventesPrecedentes = $this->ventesConfirmees($debutPrecedent, $debut->copy()->subDay());

        $ca = (float) $ventes->sum('montant_total');
        $caPrecedent = (float) $ventesPrecedentes->sum('montant_total');

        $panierMoyen = $ventes->count() > 0 ? $ca / $ventes->count() : 0.0;
        $panierMoyenPrecedent = $ventesPrecedentes->count() > 0
            ? $caPrecedent / $ventesPrecedentes->count()
            : 0.0;

        $marge = (float) DB::table('vente_lignes')
            ->join('ventes', 'ventes.id', '=', 'vente_lignes.vente_id')
            ->join('produits', 'produits.id', '=', 'vente_lignes.produit_id')
            ->where('ventes.statut', 'confirmee')
            ->whereBetween('ventes.date_vente', [
                $debut->toDateString(),
                $fin->toDateString(),
            ])
            ->selectRaw(
                'COALESCE(SUM(vente_lignes.quantite * (vente_lignes.prix_unitaire - produits.prix_achat)), 0) as marge'
            )
            ->value('marge');

        $coutAchats = (float) DB::table('achats')
            ->where('statut', 'confirme')
            ->whereBetween('date_achat', [
                $debut->toDateString(),
                $fin->toDateString(),
            ])
            ->sum('montant_total');

        $clientsActifs = (int) Client::where('actif', true)->count();
        $nouveauxClients = (int) Client::where('actif', true)
            ->where('created_at', '>=', $debut)
            ->count();

        return [
            'chiffre_affaires' => $ca,
            'chiffre_affaires_precedent' => $caPrecedent,
            'evolution_ca' => $this->tauxEvolution($ca, $caPrecedent),

            'nombre_ventes' => $ventes->count(),
            'nombre_ventes_precedent' => $ventesPrecedentes->count(),
            'evolution_ventes' => $this->tauxEvolution(
                (float) $ventes->count(),
                (float) $ventesPrecedentes->count()
            ),

            'panier_moyen' => $panierMoyen,
            'panier_moyen_precedent' => $panierMoyenPrecedent,
            'evolution_panier' => $this->tauxEvolution($panierMoyen, $panierMoyenPrecedent),

            'marge_brute' => $marge,
            'taux_marge' => $ca > 0 ? ($marge / $ca) * 100 : 0.0,

            'montant_achats' => $coutAchats,
            'clients_actifs' => $clientsActifs,
            'nouveaux_clients' => $nouveauxClients,

            'produits_actifs' => Produit::where('actif', true)->count(),
            'categories_actives' => Categorie::where('actif', true)->count(),
        ];
    }

    private function tauxEvolution(float $actuel, float $precedent): float
    {
        if ($precedent <= 0.0) {
            return $actuel > 0 ? 100.0 : 0.0;
        }

        return round((($actuel - $precedent) / $precedent) * 100, 1);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Series pour graphiques
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Serie journaliere du CA et du nombre de ventes (completee sur les
     * jours sans vente afin de ne pas casser la courbe).
     */
    private function evolutionChiffreAffaires(Carbon $debut, Carbon $fin, int $jours): array
    {
        $ventes = $this->ventesConfirmees($debut, $fin);

        $parJour = [];
        foreach ($ventes as $vente) {
            $cle = Carbon::parse($vente->date_vente)->toDateString();
            if (! isset($parJour[$cle])) {
                $parJour[$cle] = ['ca' => 0.0, 'ventes' => 0];
            }
            $parJour[$cle]['ca'] += (float) $vente->montant_total;
            $parJour[$cle]['ventes'] += 1;
        }

        $serie = [];
        for ($i = 0; $i < $jours; $i++) {
            $date = $debut->copy()->addDays($i);
            $cle = $date->toDateString();
            $serie[] = [
                'date' => $cle,
                'label' => $date->translatedFormat('d/m'),
                'ca' => round($parJour[$cle]['ca'] ?? 0.0, 2),
                'ventes' => $parJour[$cle]['ventes'] ?? 0,
            ];
        }

        return $serie;
    }

    /**
     * Repartition du CA par jour de la semaine (lundi -> dimanche).
     */
    private function repartitionVentesParJourSemaine(Carbon $debut, Carbon $fin): array
    {
        $ventes = $this->ventesConfirmees($debut, $fin);

        $cumul = array_fill(1, 7, 0.0);
        foreach ($ventes as $vente) {
            $jour = (int) Carbon::parse($vente->date_vente)->dayOfWeekIso;
            $cumul[$jour] += (float) $vente->montant_total;
        }

        $libelles = [
            1 => 'Lundi',
            2 => 'Mardi',
            3 => 'Mercredi',
            4 => 'Jeudi',
            5 => 'Vendredi',
            6 => 'Samedi',
            7 => 'Dimanche',
        ];

        $series = [];
        for ($i = 1; $i <= 7; $i++) {
            $series[] = [
                'jour' => $libelles[$i],
                'ca' => round($cumul[$i], 2),
            ];
        }

        return $series;
    }

    /**
     * Palmarès des produits sur la periode.
     */
    private function topProduits(Carbon $debut, Carbon $fin, int $limite = 8): array
    {
        $lignes = VenteLigne::query()
            ->join('ventes', 'ventes.id', '=', 'vente_lignes.vente_id')
            ->join('produits', 'produits.id', '=', 'vente_lignes.produit_id')
            ->where('ventes.statut', 'confirmee')
            ->whereBetween('ventes.date_vente', [
                $debut->toDateString(),
                $fin->toDateString(),
            ])
            ->groupBy('vente_lignes.produit_id', 'produits.nom')
            ->selectRaw(
                'vente_lignes.produit_id as id,
                 produits.nom as nom,
                 SUM(vente_lignes.quantite) as quantite,
                 SUM(vente_lignes.montant) as chiffre_affaires'
            )
            ->orderByDesc('chiffre_affaires')
            ->limit($limite)
            ->get();

        return $lignes->map(fn ($l) => [
            'id' => (int) $l->id,
            'nom' => $l->nom,
            'quantite' => (int) $l->quantite,
            'chiffre_affaires' => round((float) $l->chiffre_affaires, 2),
        ])->all();
    }

    /**
     * Repartition du CA par categorie de produits.
     */
    private function repartitionCategories(Carbon $debut, Carbon $fin): array
    {
        $lignes = DB::table('vente_lignes')
            ->join('ventes', 'ventes.id', '=', 'vente_lignes.vente_id')
            ->join('produits', 'produits.id', '=', 'vente_lignes.produit_id')
            ->leftJoin('categories', 'categories.id', '=', 'produits.categorie_id')
            ->where('ventes.statut', 'confirmee')
            ->whereBetween('ventes.date_vente', [
                $debut->toDateString(),
                $fin->toDateString(),
            ])
            ->groupBy('categories.nom')
            ->selectRaw(
                "COALESCE(categories.nom, 'Sans categorie') as categorie,
                 SUM(vente_lignes.montant) as chiffre_affaires"
            )
            ->orderByDesc('chiffre_affaires')
            ->get();

        $total = (float) $lignes->sum('chiffre_affaires');

        return $lignes->map(fn ($l) => [
            'categorie' => $l->categorie,
            'chiffre_affaires' => round((float) $l->chiffre_affaires, 2),
            'part' => $total > 0 ? round(((float) $l->chiffre_affaires / $total) * 100, 1) : 0.0,
        ])->all();
    }

    /**
     * Repartition des ventes par statut (confirmee / brouillon / annulee).
     */
    private function repartitionParStatut(Carbon $debut, Carbon $fin): array
    {
        return DB::table('ventes')
            ->whereBetween('date_vente', [
                $debut->toDateString(),
                $fin->toDateString(),
            ])
            ->groupBy('statut')
            ->selectRaw('statut, COUNT(*) as total, COALESCE(SUM(montant_total), 0) as montant')
            ->get()
            ->map(fn ($l) => [
                'statut' => $l->statut,
                'total' => (int) $l->total,
                'montant' => round((float) $l->montant, 2),
            ])
            ->all();
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Blocs operationnels
    // ─────────────────────────────────────────────────────────────────────────

    private function alertes(): array
    {
        $faibles = $this->produitsStockFaible()->map(function (Produit $produit) {
            $quantite = (float) Lot::where('produit_id', $produit->id)->sum('quantite');

            return [
                'id' => $produit->id,
                'nom' => $produit->nom,
                'stock' => $quantite,
                'stock_minimum' => (float) $produit->stock_minimum,
            ];
        })->sortByDesc('stock')->values()->all();

        $ruptures = $this->produitsEnRupture()->map(fn (Produit $produit) => [
            'id' => $produit->id,
            'nom' => $produit->nom,
        ])->values()->all();

        $peremptions = $this->lotsPeremptionProche(30)->map(function (Lot $lot) {
            $jours = (int) now()->startOfDay()->diffInDays(
                Carbon::parse($lot->date_peremption)->startOfDay(),
                false
            );

            return [
                'id' => $lot->id,
                'produit_id' => $lot->produit_id,
                'produit' => $lot->produit?->nom ?? '—',
                'numero_lot' => $lot->numero_lot,
                'date_peremption' => Carbon::parse($lot->date_peremption)->toDateString(),
                'jours_restants' => $jours,
                'quantite' => (int) $lot->quantite,
            ];
        })->values()->all();

        return [
            'stocks_faibles' => $faibles,
            'ruptures' => $ruptures,
            'peremptions' => $peremptions,
            'total' => count($faibles) + count($ruptures) + count($peremptions),
        ];
    }

    private function caisseOuverte(): ?array
    {
        $caisse = Caisse::with('utilisateur')
            ->where('statut', 'ouverte')
            ->orderByDesc('date_ouverture')
            ->first();

        if (! $caisse) {
            return null;
        }

        $mouvements = DB::table('mouvements_caisse')
            ->where('caisse_id', $caisse->id)
            ->selectRaw(
                "COALESCE(SUM(CASE WHEN type = 'entree' THEN montant ELSE 0 END), 0) as entrees,
                 COALESCE(SUM(CASE WHEN type = 'sortie' THEN montant ELSE 0 END), 0) as sorties"
            )
            ->first();

        $entrees = (float) ($mouvements->entrees ?? 0);
        $sorties = (float) ($mouvements->sorties ?? 0);

        return [
            'id' => $caisse->id,
            'montant_initial' => (float) $caisse->montant_initial,
            'date_ouverture' => Carbon::parse($caisse->date_ouverture)->toIso8601String(),
            'utilisateur' => $caisse->utilisateur?->name ?? '—',
            'entrees' => round($entrees, 2),
            'sorties' => round($sorties, 2),
            'solde_theorique' => round((float) $caisse->montant_initial + $entrees - $sorties, 2),
        ];
    }

    /**
     * Lots dont la peremption est la plus imminente.
     */
    private function topLotsPeremption(int $jours, int $limite = 6): array
    {
        return $this->lotsPeremptionProche($jours)
            ->take($limite)
            ->map(function (Lot $lot) {
                $joursRestants = (int) now()->startOfDay()->diffInDays(
                    Carbon::parse($lot->date_peremption)->startOfDay(),
                    false
                );

                return [
                    'id' => $lot->id,
                    'produit' => $lot->produit?->nom ?? '—',
                    'numero_lot' => $lot->numero_lot,
                    'date_peremption' => Carbon::parse($lot->date_peremption)->toDateString(),
                    'jours_restants' => $joursRestants,
                    'quantite' => (int) $lot->quantite,
                    'criticite' => $joursRestants <= 0
                        ? 'expire'
                        : ($joursRestants <= 15 ? 'critique' : 'a_surveiller'),
                ];
            })
            ->all();
    }

    /**
     * Creances clients : factures non soldees et anciennete.
     */
    private function creances(): array
    {
        $factures = Facture::whereIn('statut', ['impayee', 'partiellement_payee'])
            ->get(['id', 'numero', 'date_facture', 'montant_total', 'statut']);

        $reglements = Reglement::selectRaw('facture_id, COALESCE(SUM(montant), 0) as total')
            ->groupBy('facture_id')
            ->pluck('total', 'facture_id');

        $lignes = [];
        $totalDu = 0.0;

        foreach ($factures as $facture) {
            $regle = (float) ($reglements[$facture->id] ?? 0);
            $reste = (float) $facture->montant_total - $regle;

            if ($reste <= 0) {
                continue;
            }

            $age = (int) now()->startOfDay()->diffInDays(
                Carbon::parse($facture->date_facture)->startOfDay(),
                false
            );

            $totalDu += $reste;

            $lignes[] = [
                'id' => $facture->id,
                'numero' => $facture->numero,
                'date_facture' => Carbon::parse($facture->date_facture)->toDateString(),
                'montant_total' => (float) $facture->montant_total,
                'reste_a_payer' => round($reste, 2),
                'statut' => $facture->statut,
                'anciennete_jours' => $age,
            ];
        }

        usort($lignes, fn ($a, $b) => $b['reste_a_payer'] <=> $a['reste_a_payer']);

        return [
            'nombre' => count($lignes),
            'montant_total' => round($totalDu, 2),
            'lignes' => array_slice($lignes, 0, 6),
        ];
    }

    private function dernieresVentes(int $limite = 6): array
    {
        return Vente::with('client')
            ->orderByDesc('date_vente')
            ->orderByDesc('id')
            ->limit($limite)
            ->get()
            ->map(fn (Vente $vente) => [
                'id' => $vente->id,
                'numero' => $vente->numero,
                'date_vente' => Carbon::parse($vente->date_vente)->toDateString(),
                'client' => $vente->client?->nom ?? 'Client de passage',
                'montant_total' => (float) $vente->montant_total,
                'statut' => $vente->statut,
            ])
            ->all();
    }

    /**
     * Valorisation du stock et couverture moyenne.
     */
    private function valorisationStock(): array
    {
        $lignes = DB::table('lots')
            ->join('produits', 'produits.id', '=', 'lots.produit_id')
            ->where('lots.quantite', '>', 0)
            ->selectRaw(
                'COALESCE(SUM(lots.quantite), 0) as unites,
                 COALESCE(SUM(lots.quantite * produits.prix_achat), 0) as valeur_achat,
                 COALESCE(SUM(lots.quantite * produits.prix_vente), 0) as valeur_vente'
            )
            ->first();

        $unites = (float) ($lignes->unites ?? 0);
        $valeurAchat = (float) ($lignes->valeur_achat ?? 0);

        $lignesVendues = (float) VenteLigne::query()
            ->join('ventes', 'ventes.id', '=', 'vente_lignes.vente_id')
            ->where('ventes.statut', 'confirmee')
            ->whereBetween('ventes.date_vente', [
                now()->subDays(29)->toDateString(),
                now()->toDateString(),
            ])
            ->sum('vente_lignes.quantite');

        $rotation = $lignesVendues > 0 ? round($unites / $lignesVendues, 1) : 0.0;

        return [
            'unites' => (int) $unites,
            'valeur_achat' => round($valeurAchat, 2),
            'valeur_vente' => round((float) ($lignes->valeur_vente ?? 0), 2),
            'marge_potentielle' => round((float) ($lignes->valeur_vente ?? 0) - $valeurAchat, 2),
            'rotation_mois' => $rotation,
        ];
    }

    /**
     * Suivi des commandes fournisseurs en cours.
     */
    private function approvisionnement(): array
    {
        $parStatut = Achat::whereIn('statut', ['brouillon', 'confirme'])
            ->get(['statut', 'montant_total'])
            ->groupBy('statut')
            ->map(fn ($groupe) => [
                'nombre' => $groupe->count(),
                'montant' => round((float) $groupe->sum('montant_total'), 2),
            ]);

        return [
            'en_attente' => $parStatut->get('brouillon', ['nombre' => 0, 'montant' => 0.0]),
            'confirmees' => $parStatut->get('confirme', ['nombre' => 0, 'montant' => 0.0]),
        ];
    }
}
