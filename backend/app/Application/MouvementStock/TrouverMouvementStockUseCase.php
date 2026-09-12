<?php

namespace App\Application\MouvementStock;

use App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface;
use App\Models\MouvementStock;

class TrouverMouvementStockUseCase
{
    public function __construct(
        private MouvementStockRepositoryInterface $mouvementStockRepository
    ) {
    }

    public function executer(int $id): ?MouvementStock
    {
        return $this->mouvementStockRepository->trouverParId($id);
    }
}