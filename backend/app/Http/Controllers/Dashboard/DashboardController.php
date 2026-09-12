<?php

namespace App\Http\Controllers\Dashboard;

use App\Application\Dashboard\ObtenirDashboardUseCase;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index(
        ObtenirDashboardUseCase $useCase
    ) {
        return response()->json([
            'data' => $useCase->executer(),
        ]);
    }
}