<?php

namespace App\Http\Controllers\Lot;

use App\Application\Lot\CreerLotUseCase;
use App\Application\Lot\ListerLotsUseCase;
use App\Application\Lot\TrouverLotUseCase;
use App\Application\Lot\ModifierLotUseCase;
use App\Application\Lot\SupprimerLotUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LotController extends Controller
{
    public function __construct(
        private ListerLotsUseCase $listerLotsUseCase,
        private TrouverLotUseCase $trouverLotUseCase,
        private CreerLotUseCase $creerLotUseCase,
        private ModifierLotUseCase $modifierLotUseCase,
        private SupprimerLotUseCase $supprimerLotUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $lots = $this->listerLotsUseCase->executer();

        return response()->json($lots);
    }

    public function show(int $id): JsonResponse
    {
        $lot = $this->trouverLotUseCase->executer($id);

        if (!$lot) {
            return response()->json([
                'message' => 'Lot introuvable.'
            ], 404);
        }

        return response()->json($lot);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'produit_id' => ['required', 'integer', 'exists:produits,id'],
            'numero_lot' => ['required', 'string', 'max:100'],
            'date_peremption' => ['required', 'date'],
            'quantite' => ['required', 'integer', 'min:0'],
        ]);

        $lot = $this->creerLotUseCase->executer($donnees);

        return response()->json($lot, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $donnees = $request->validate([
            'produit_id' => ['sometimes', 'required', 'integer', 'exists:produits,id'],
            'numero_lot' => ['sometimes', 'required', 'string', 'max:100'],
            'date_peremption' => ['sometimes', 'required', 'date'],
            
        ]);

        $lot = $this->modifierLotUseCase->executer($id, $donnees);

        if (!$lot) {
            return response()->json([
                'message' => 'Lot introuvable.'
            ], 404);
        }

        return response()->json($lot);
    }

    public function destroy(int $id): JsonResponse
    {
        $supprime = $this->supprimerLotUseCase->executer($id);

        if (!$supprime) {
            return response()->json([
                'message' => 'Lot introuvable.'
            ], 404);
        }

        return response()->json([
            'message' => 'Lot supprimé avec succès.'
        ]);
    }
}