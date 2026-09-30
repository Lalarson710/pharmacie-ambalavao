<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteLigneRepositoryInterface;
use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\Vente;
use App\Models\VenteLigne;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AjouterLigneVenteUseCase
{
    public function __construct(
        private VenteLigneRepositoryInterface $venteLigneRepository,
        private VenteRepositoryInterface $venteRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase,
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(array $donnees): VenteLigne
    {
        return DB::transaction(function () use ($donnees) {

            $vente = $this->venteRepository
                ->trouverParId($donnees['vente_id']);

            if (!$vente) {
                throw new RuntimeException(
                    'Vente introuvable.'
                );
            }

            if ($vente->statut !== 'brouillon') {
                throw new RuntimeException(
                    'Impossible d’ajouter une ligne à une vente qui n’est plus en brouillon.'
                );
            }

            $lot = $this->lotRepository
                ->trouverParId($donnees['lot_id']);

            if (!$lot) {
                throw new RuntimeException(
                    'Lot introuvable.'
                );
            }

            if ($lot->produit_id !== $donnees['produit_id']) {
                throw new RuntimeException(
                    'Le lot ne correspond pas au produit sélectionné.'
                );
            }

            if ($lot->date_peremption->isBefore(now()->startOfDay())) {
                throw new RuntimeException(
                    'Impossible de vendre un produit dont le lot est périmé.'
                );
            }

            // Gestion des conditionnements
            $quantiteConditionnement = $donnees['quantite']; // Quantité saisie par l'utilisateur (en conditionnement)
            $quantiteBase = $quantiteConditionnement;
            $prixUnitaire = $lot->produit->prix_vente; // Prix par défaut (unité de base)

            if (!empty($donnees['conditionnement_id'])) {
                $conditionnement = $this->conditionnementRepository->trouverParId($donnees['conditionnement_id']);
                if ($conditionnement) {
                    $quantiteBase = $quantiteConditionnement * $conditionnement->quantite_base;
                    $prixUnitaire = $conditionnement->prix_vente; // Prix du conditionnement
                    $donnees['conditionnement_id'] = $conditionnement->id;
                    $donnees['quantite_conditionnement'] = $quantiteConditionnement;
                    $donnees['quantite_base'] = $quantiteBase;
                }
            } else {
                // Compatibilité: si pas de conditionnement, quantite = quantite_base
                $donnees['quantite_conditionnement'] = $quantiteConditionnement;
                $donnees['quantite_base'] = $quantiteBase;
            }

            // Vérifier le stock en unité de base
            if ($lot->quantite < $quantiteBase) {
                throw new RuntimeException(
                    'Stock insuffisant pour cette vente.'
                );
            }

            $montant = $quantiteConditionnement * $prixUnitaire;

            $ligne = $this->venteLigneRepository->creer([
                'vente_id' => $vente->id,
                'produit_id' => $donnees['produit_id'],
                'lot_id' => $donnees['lot_id'],
                'conditionnement_id' => $donnees['conditionnement_id'] ?? null,
                'quantite' => $quantiteBase, // Pour compatibilité, on stocke la quantité base dans quantite
                'quantite_conditionnement' => $donnees['quantite_conditionnement'],
                'quantite_base' => $donnees['quantite_base'],
                'prix_unitaire' => $prixUnitaire,
                'montant' => $montant,
            ]);

            // Mouvement de stock en unité de base
            $this->creerMouvementStockUseCase->executer([
                'lot_id' => $lot->id,
                'type' => 'sortie',
                'quantite' => $quantiteBase,
                'motif' => 'Sortie suite à une vente',
            ]);

            $vente = $this->venteRepository
                ->trouverParId($vente->id);

            $nouveauTotal = $vente->lignes->sum('montant');

            $this->venteRepository->modifier(
                $vente,
                [
                    'montant_total' => $nouveauTotal,
                ]
            );

            return $ligne;
        });
    }
}