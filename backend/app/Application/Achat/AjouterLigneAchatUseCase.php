<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatLigneRepositoryInterface;
use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\AchatLigne;
use Illuminate\Support\Facades\DB;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;

class AjouterLigneAchatUseCase
{
    public function __construct(
        private AchatLigneRepositoryInterface $achatLigneRepository,
        private AchatRepositoryInterface $achatRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
    ) {
    }

    public function executer(array $donnees): AchatLigne
    {
        return DB::transaction(function () use ($donnees) {

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

        $this->creerMouvementStockUseCase->executer([
            'lot_id' => $lot->id,
            'type' => 'entree',
            'quantite' => $donnees['quantite'],
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