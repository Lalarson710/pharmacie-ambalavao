<?php

namespace App\Application\Stock;

use App\Application\Stock\Ports\StockRepositoryInterface;

class ListerStockParProduitUseCase
{
    public function __construct(
        private StockRepositoryInterface $stockRepository
    ) {
    }

    public function executer(): array
    {
        return $this->stockRepository->listerStockParProduit();
    }
}