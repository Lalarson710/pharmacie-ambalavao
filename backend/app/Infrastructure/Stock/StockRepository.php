<?php

namespace App\Infrastructure\Stock;

use App\Application\Stock\Ports\StockRepositoryInterface;
use App\Models\Lot;
use App\Models\Produit;

class StockRepository implements StockRepositoryInterface
{
    public function listerStocksFaibles(): array
    {
        return Lot::with('produit')
            ->whereHas('produit', function ($query) {
                $query->whereColumn(
                    'lots.quantite',
                    '<=',
                    'produits.stock_minimum'
                );
            })
            ->get()
            ->all();
    }

    public function listerStock(): array
    {
        return Lot::with('produit')
            ->get()
            ->all();
    }

    public function listerStockParProduit(): array
    {
        return Produit::with('categorie', 'unite')
            ->withSum('lots', 'quantite')
            ->get()
            ->all();
    }

    public function listerLotsProchesPeremption(int $jours): array
    {
        $dateLimite = now()->addDays($jours)->toDateString();

        return Lot::with('produit')
            ->whereDate('date_peremption', '<=', $dateLimite)
            ->whereDate('date_peremption', '>=', now()->toDateString())
            ->orderBy('date_peremption')
            ->get()
            ->all();
    }

    public function listerStocksEnRupture(): array
    {
        return Lot::with('produit')
            ->where('quantite', 0)
            ->get()
            ->all();
    }
}