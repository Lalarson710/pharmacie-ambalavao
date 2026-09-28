<?php

namespace App\Http\Controllers\MouvementStock;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Application\MouvementStock\ListerMouvementsStockUseCase;
use App\Application\MouvementStock\ModifierMouvementStockUseCase;
use App\Application\MouvementStock\SupprimerMouvementStockUseCase;
use App\Application\MouvementStock\TrouverMouvementStockUseCase;
use Illuminate\Http\Request;

class MouvementStockController extends Controller
{
    public function __construct(
        private ListerMouvementsStockUseCase $listerMouvementsStockUseCase,
        private TrouverMouvementStockUseCase $trouverMouvementStockUseCase,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase,
        private ModifierMouvementStockUseCase $modifierMouvementStockUseCase,
        private SupprimerMouvementStockUseCase $supprimerMouvementStockUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $mouvementsStock = $this->listerMouvementsStockUseCase->executer();

        return response()->json($mouvementsStock);
    }

    public function show(int $id): JsonResponse
    {
        $mouvementStock = $this->trouverMouvementStockUseCase->executer($id);

        if (!$mouvementStock) {
            return response()->json([
                'message' => 'Mouvement de stock introuvable.'
            ], 404);
        }

        return response()->json($mouvementStock);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'lot_id' => ['required', 'integer', 'exists:lots,id'],
            'type' => ['required', 'in:entree,sortie,ajustement'],
            'quantite' => [
                'required',
                'integer',
                $request->input('type') === 'ajustement' ? 'min:0' : 'min:1',
            ],
            'motif' => ['nullable', 'string'],
        ]);

        $user = $request->user();

        if (
            $donnees['type'] === 'entree'
            && !$user->aLaPermission('stock.entry')
        ) {
            return response()->json([
                'message' => 'Accès interdit.'
            ], 403);
        }

        if (
            $donnees['type'] === 'sortie'
            && !$user->aLaPermission('stock.exit')
        ) {
            return response()->json([
                'message' => 'Accès interdit.'
            ], 403);
        }

        if (
            $donnees['type'] === 'ajustement'
            && !$user->aLaPermission('stock.inventory')
        ) {
            return response()->json([
                'message' => 'Accès interdit.'
            ], 403);
        }

        try {
            $mouvementStock = $this->creerMouvementStockUseCase
                ->executer($donnees);

            return response()->json($mouvementStock, 201);

        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $mouvementStock = $this->trouverMouvementStockUseCase->executer($id);

        if (!$mouvementStock) {
            return response()->json([
                'message' => 'Mouvement de stock introuvable.'
            ], 404);
        }

        try {
            $donnees = $request->validate([
                'type' => ['sometimes', 'in:entree,sortie,ajustement'],
                'quantite' => ['sometimes', 'integer', 'min:1'],
                'motif' => ['nullable', 'string'],
            ]);

            $mouvementStock = $this->modifierMouvementStockUseCase
                ->executer($mouvementStock, $donnees);

            return response()->json($mouvementStock);

        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $mouvementStock = $this->trouverMouvementStockUseCase->executer($id);

        if (!$mouvementStock) {
            return response()->json([
                'message' => 'Mouvement de stock introuvable.'
            ], 404);
        }

        try {
            $this->supprimerMouvementStockUseCase->executer($mouvementStock);

            return response()->json([
                'message' => 'Mouvement de stock supprimé avec succès.'
            ]);

        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}