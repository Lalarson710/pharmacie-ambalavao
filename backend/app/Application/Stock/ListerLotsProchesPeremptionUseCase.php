<?php

namespace App\Application\Stock;

use App\Application\Stock\Ports\StockRepositoryInterface;

class ListerLotsProchesPeremptionUseCase
{
    public function __construct(
        private StockRepositoryInterface $stockRepository
    ) {
    }

    public function executer(int $jours): array
    {
        return $this->stockRepository->listerLotsProchesPeremption($jours);
    }
}