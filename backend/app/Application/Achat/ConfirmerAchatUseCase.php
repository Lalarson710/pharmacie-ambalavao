<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Models\Achat;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ConfirmerAchatUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
    ) {
    }

    public function executer(Achat $achat): Achat
    {
        return DB::transaction(function () use ($achat) {

            if ($achat->statut !== 'brouillon') {
                throw new RuntimeException(
                    'Seul un achat brouillon peut être confirmé.'
                );
            }

            if ($achat->lignes->isEmpty()) {
                throw new RuntimeException(
                    'Impossible de confirmer un achat sans ligne.'
                );
            }

            foreach ($achat->lignes as $ligne) {

                $lot = $this->lotRepository->creer([
                    'produit_id' => $ligne->produit_id,
                    'numero_lot' => $ligne->numero_lot,
                    'date_peremption' => $ligne->date_peremption,
                    'quantite' => 0,
                ]);

                $this->creerMouvementStockUseCase->executer([
                    'lot_id' => $lot->id,
                    'type' => 'entree',
                    'quantite' => $ligne->quantite,
                    'motif' => 'Entrée suite à la confirmation de l’achat',
                ]);
            }

            $achat->statut = 'confirme';

            return $this->achatRepository->modifier(
                $achat,
                ['statut' => 'confirme']
            );
        });
    }
}