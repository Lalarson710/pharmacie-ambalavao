<?php

namespace App\Application\Stock\Ports;

interface StockRepositoryInterface
{
    public function listerStock(): array;

    public function listerStockParProduit(): array;

    public function listerStocksFaibles(): array;

    public function listerLotsProchesPeremption(int $jours): array;

    public function listerStocksEnRupture(): array;
}