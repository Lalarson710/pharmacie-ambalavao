<?php

namespace App\Application\MouvementStock;

use App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface;

class ListerMouvementsStockUseCase
{
    public function __construct(
        private MouvementStockRepositoryInterface $mouvementStockRepository
    ) {
    }

    public function executer(): array
    {
        return $this->mouvementStockRepository->lister();
    }
}