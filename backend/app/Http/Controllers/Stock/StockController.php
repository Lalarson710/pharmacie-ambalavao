<?php

namespace App\Http\Controllers\Stock;

use App\Application\Stock\ListerStocksFaiblesUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Application\Stock\ListerStockUseCase;
use App\Application\Stock\ListerLotsProchesPeremptionUseCase;
use App\Application\Stock\ListerStocksEnRuptureUseCase;
use App\Application\Stock\ListerStockParProduitUseCase;

class StockController extends Controller
{
    public function __construct(
        private ListerStockUseCase $listerStockUseCase,
        private ListerStocksFaiblesUseCase $listerStocksFaiblesUseCase,
        private ListerLotsProchesPeremptionUseCase $listerLotsProchesPeremptionUseCase,
        private ListerStocksEnRuptureUseCase $listerStocksEnRuptureUseCase,
        private ListerStockParProduitUseCase $listerStockParProduitUseCase
    ) {
    }

    public function stocksFaibles(): JsonResponse
    {
        $stocksFaibles = $this->listerStocksFaiblesUseCase->executer();

        return response()->json($stocksFaibles);
    }

    public function index(): JsonResponse
    {
        $stock = $this->listerStockUseCase->executer();

        return response()->json($stock);
    }

    public function stockParProduit(): JsonResponse
    {
        $stock = $this->listerStockParProduitUseCase->executer();

        return response()->json($stock);
    }

    public function lotsProchesPeremption(int $jours = 30): JsonResponse
    {
        $lots = $this->listerLotsProchesPeremptionUseCase->executer($jours);

        return response()->json($lots);
    }

    public function stocksEnRupture(): JsonResponse
    {
        $stocksEnRupture = $this->listerStocksEnRuptureUseCase->executer();

        return response()->json($stocksEnRupture);
    }
}