<?php

namespace App\Application\Stock;

use App\Application\Stock\Ports\StockRepositoryInterface;

class ListerStockUseCase
{
    public function __construct(
        private StockRepositoryInterface $stockRepository
    ) {
    }

    public function executer(): array
    {
        return $this->stockRepository->listerStock();
    }
}