<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteLigneRepositoryInterface;
use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
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
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
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

            if ($lot->quantite < $donnees['quantite']) {
                throw new RuntimeException(
                    'Stock insuffisant pour cette vente.'
                );
            }

            $prixUnitaire = $lot->produit->prix_vente;

            $montant = $donnees['quantite'] * $prixUnitaire;

            $ligne = $this->venteLigneRepository->creer([
                'vente_id' => $vente->id,
                'produit_id' => $donnees['produit_id'],
                'lot_id' => $donnees['lot_id'],
                'quantite' => $donnees['quantite'],
                'prix_unitaire' => $prixUnitaire,
                'montant' => $montant,
            ]);

            $this->creerMouvementStockUseCase->executer([
                'lot_id' => $lot->id,
                'type' => 'sortie',
                'quantite' => $donnees['quantite'],
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