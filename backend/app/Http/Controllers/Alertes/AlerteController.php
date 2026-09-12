<?php

namespace App\Http\Controllers\Alertes;

use App\Application\Alertes\ListerAlertesPeremptionUseCase;
use App\Application\Alertes\ListerAlertesRuptureUseCase;
use App\Application\Alertes\ListerAlertesStockFaibleUseCase;
use App\Application\Alertes\ListerToutesAlertesUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AlerteController extends Controller
{
    public function stockFaible(
        ListerAlertesStockFaibleUseCase $useCase
    ) {
        return response()->json([
            'data' => $useCase->executer(),
        ]);
    }

    public function ruptures(
        ListerAlertesRuptureUseCase $useCase
    ) {
        return response()->json([
            'data' => $useCase->executer(),
        ]);
    }

    public function peremptions(
        Request $request,
        ListerAlertesPeremptionUseCase $useCase
    ) {
        $jours = (int) $request->query('jours', 30);

        return response()->json([
            'data' => $useCase->executer($jours),
        ]);
    }

    public function toutes(
        Request $request,
        ListerToutesAlertesUseCase $useCase
    ) {
        $jours = (int) $request->query('jours', 30);

        return response()->json(
            $useCase->executer($jours)
        );
    }
}