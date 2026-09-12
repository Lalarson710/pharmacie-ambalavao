<?php

namespace App\Infrastructure\Statistiques;

use App\Application\Statistiques\Ports\StatistiquesRepositoryInterface;
use App\Models\Vente;
use App\Models\VenteLigne;
use Illuminate\Support\Facades\DB;

class StatistiquesRepository implements StatistiquesRepositoryInterface
{
    public function ventes(
        string $dateDebut,
        string $dateFin
    ): array {
        $ventes = Vente::whereBetween(
            'date_vente',
            [$dateDebut, $dateFin]
        )
            ->where('statut', 'confirmee')
            ->get();

        return [
            'nombre_ventes' => $ventes->count(),
            'chiffre_affaires' => (float) $ventes->sum('montant_total'),
            'ventes' => $ventes->all(),
        ];
    }

    public function produitsPlusVendus(
        string $dateDebut,
        string $dateFin
    ): array {
        return VenteLigne::query()
            ->join('ventes', 'vente_lignes.vente_id', '=', 'ventes.id')
            ->join(
                'produits',
                'vente_lignes.produit_id',
                '=',
                'produits.id'
            )
            ->whereBetween(
                'ventes.date_vente',
                [$dateDebut, $dateFin]
            )
            ->where('ventes.statut', 'confirmee')
            ->select(
                'produits.id',
                'produits.nom',
                DB::raw('SUM(vente_lignes.quantite) as quantite_vendue'),
                DB::raw('SUM(vente_lignes.montant) as chiffre_affaires')
            )
            ->groupBy(
                'produits.id',
                'produits.nom'
            )
            ->orderByDesc('quantite_vendue')
            ->get()
            ->all();
    }

    public function chiffreAffaires(
        string $dateDebut,
        string $dateFin
    ): array {
        $total = Vente::whereBetween(
            'date_vente',
            [$dateDebut, $dateFin]
        )
            ->where('statut', 'confirmee')
            ->sum('montant_total');

        return [
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'chiffre_affaires' => (float) $total,
        ];
    }
}