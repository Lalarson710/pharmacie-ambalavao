<?php

namespace App\Application\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Models\Lot;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use Illuminate\Support\Facades\DB;

class CreerLotUseCase
{
    public function __construct(
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
    ) {
    }

    public function executer(array $donnees): Lot
    {
        return DB::transaction(function () use ($donnees) {

            $quantiteInitiale = $donnees['quantite'] ?? 0;

            $donneesLot = $donnees;

            unset($donneesLot['quantite']);

            $lot = $this->lotRepository->creer($donneesLot);

            if ($quantiteInitiale > 0) {
                $this->creerMouvementStockUseCase->executer([
                    'lot_id' => $lot->id,
                    'type' => 'entree',
                    'quantite' => $quantiteInitiale,
                    'motif' => 'Stock initial à la création du lot',
                ]);
            }

            return $lot->fresh();
        });
    }
}