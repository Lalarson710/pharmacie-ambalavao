<?php

namespace App\Application\MouvementStock;

use App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface;
use App\Models\MouvementStock;

class ModifierMouvementStockUseCase
{
    public function __construct(
        private MouvementStockRepositoryInterface $mouvementStockRepository
    ) {
    }

    public function executer(
        MouvementStock $mouvementStock,
        array $donnees
    ): MouvementStock {
        return $this->mouvementStockRepository->modifier(
            $mouvementStock,
            $donnees
        );
    }
}