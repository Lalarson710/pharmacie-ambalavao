<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatLigneRepositoryInterface;
use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\AchatLigne;
use Illuminate\Support\Facades\DB;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;

class AjouterLigneAchatUseCase
{
    public function __construct(
        private AchatLigneRepositoryInterface $achatLigneRepository,
        private AchatRepositoryInterface $achatRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase,
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(array $donnees): AchatLigne
    {
        return DB::transaction(function () use ($donnees) {

            // Calculer la quantité en unité de base si un conditionnement est fourni
            $quantiteBase = $donnees['quantite'];
            if (!empty($donnees['conditionnement_id'])) {
                $conditionnement = $this->conditionnementRepository->trouverParId($donnees['conditionnement_id']);
                if ($conditionnement) {
                    $quantiteBase = $donnees['quantite'] * $conditionnement->quantite_base;
                    $donnees['quantite_base'] = $quantiteBase;
                }
            } else {
                // Par défaut, la quantité est déjà en unité de base
                $donnees['quantite_base'] = $quantiteBase;
            }

            $montant = $donnees['quantite']
                * $donnees['prix_unitaire'];

            $donnees['montant'] = $montant;

            $ligne = $this->achatLigneRepository->creer($donnees);

            $achat = $this->achatRepository
                ->trouverParId($donnees['achat_id']);

            if ($achat && $achat->statut === 'confirme') {

                $lot = $this->lotRepository->creer([
                    'produit_id' => $donnees['produit_id'],
                    'numero_lot' => $donnees['numero_lot'],
                    'date_peremption' => $donnees['date_peremption'],
                    'quantite' => 0,
                ]);

                // Utiliser la quantité en unité de base pour le mouvement de stock
                $this->creerMouvementStockUseCase->executer([
                    'lot_id' => $lot->id,
                    'type' => 'entree',
                    'quantite' => $quantiteBase,
                    'motif' => 'Entrée suite à un achat',
                ]);
            }

            $achat = $this->achatRepository
                ->trouverParId($donnees['achat_id']);

            if ($achat) {
                $nouveauTotal = $achat->lignes->sum('montant');

                $this->achatRepository->modifier(
                    $achat,
                    [
                        'montant_total' => $nouveauTotal,
                    ]
                );
            }

            return $ligne;
        });
    }
}