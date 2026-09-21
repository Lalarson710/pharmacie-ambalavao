<?php

namespace App\Http\Controllers\Unite;

use App\Application\Unite\CreerUniteUseCase;
use App\Application\Unite\ListerUnitesUseCase;
use App\Application\Unite\TrouverUniteUseCase;
use App\Application\Unite\ModifierUniteUseCase;
use App\Application\Unite\SupprimerUniteUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UniteController extends Controller
{
    public function __construct(
        private ListerUnitesUseCase $listerUnitesUseCase,
        private TrouverUniteUseCase $trouverUniteUseCase,
        private CreerUniteUseCase $creerUniteUseCase,
        private ModifierUniteUseCase $modifierUniteUseCase,
        private SupprimerUniteUseCase $supprimerUniteUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $unites = $this->listerUnitesUseCase->executer();

        return response()->json($unites);
    }

    public function show(int $id): JsonResponse
    {
        $unite = $this->trouverUniteUseCase->executer($id);

        if (!$unite) {
            return response()->json([
                'message' => 'Unité introuvable.'
            ], 404);
        }

        return response()->json($unite);
    }

    public function store(Request $request): JsonResponse
    {
        $donnes = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'abreviation' => ['sometimes', 'nullable', 'string', 'max:10'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $unite = $this->creerUniteUseCase->executer($donnes);

        return response()->json($unite, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $donnes = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:100'],
            'abreviation' => ['sometimes', 'nullable', 'string', 'max:10'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $unite = $this->modifierUniteUseCase->executer($id, $donnes);

        if (!$unite) {
            return response()->json([
                'message' => 'Unité introuvable.'
            ], 404);
        }

        return response()->json($unite);
    }

    public function destroy(int $id): JsonResponse
    {
        $resultat = $this->supprimerUniteUseCase->executer($id);

        if ($resultat === null) {
            return response()->json([
                'message' => 'Unité introuvable.'
            ], 404);
        }

        if ($resultat === 'ok') {
            return response()->json([
                'message' => 'Unité supprimée avec succès.'
            ]);
        }

        return response()->json([
            'message' => $resultat
        ], 409);
    }

}
