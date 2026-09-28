<?php

namespace App\Application\MouvementStock;

use App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface;
use App\Models\MouvementStock;
use RuntimeException;

class SupprimerMouvementStockUseCase
{
    public function __construct(
        private MouvementStockRepositoryInterface $mouvementStockRepository
    ) {
    }

    public function executer(MouvementStock $mouvementStock): void
    {
        $this->mouvementStockRepository->supprimer($mouvementStock);
    }
}