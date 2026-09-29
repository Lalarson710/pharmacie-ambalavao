<?php

namespace App\Http\Controllers\Dashboard;

use App\Application\Dashboard\ObtenirDashboardUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(
        Request $request,
        ObtenirDashboardUseCase $useCase
    ) {
        $jours = (int) $request->query('periode', 30);

        return response()->json([
            'data' => $useCase->executer($jours),
        ]);
    }
}
