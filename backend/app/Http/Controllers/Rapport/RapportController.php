<?php

namespace App\Http\Controllers\Rapport;

use App\Application\Rapport\CreerRapportUseCase;
use App\Application\Rapport\ListerRapportsUseCase;
use App\Application\Rapport\ModifierRapportUseCase;
use App\Application\Rapport\SupprimerRapportUseCase;
use App\Application\Rapport\TrouverRapportUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class RapportController
{
    public function __construct(
        private ListerRapportsUseCase $listerRapportsUseCase,
        private TrouverRapportUseCase $trouverRapportUseCase,
        private CreerRapportUseCase $creerRapportUseCase,
        private ModifierRapportUseCase $modifierRapportUseCase,
        private SupprimerRapportUseCase $supprimerRapportUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerRapportsUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $rapport = $this->trouverRapportUseCase
            ->executer($id);

        if (!$rapport) {
            return response()->json([
                'message' => 'Rapport introuvable.'
            ], 404);
        }

        return response()->json($rapport);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'type' => 'required|string|max:50',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'montant_total' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $donnees['montant_total'] =
            $donnees['montant_total'] ?? 0;

        try {
            $rapport = $this->creerRapportUseCase
                ->executer($donnees);

            return response()->json($rapport, 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $rapport = $this->trouverRapportUseCase->executer($id);

        if (!$rapport) {
            return response()->json([
                'message' => 'Rapport introuvable.'
            ], 404);
        }

        try {
            $donnees = $request->validate([
                'type' => 'sometimes|string|max:50',
                'date_debut' => 'sometimes|date',
                'date_fin' => 'sometimes|date|after_or_equal:date_debut',
                'montant_total' => 'nullable|numeric|min:0',
                'description' => 'nullable|string',
            ]);

            $rapport = $this->modifierRapportUseCase
                ->executer($rapport, $donnees);

            return response()->json($rapport);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $rapport = $this->trouverRapportUseCase->executer($id);

        if (!$rapport) {
            return response()->json([
                'message' => 'Rapport introuvable.'
            ], 404);
        }

        try {
            $this->supprimerRapportUseCase->executer($rapport);

            return response()->json([
                'message' => 'Rapport supprimé avec succès.'
            ]);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function impression(int $id): JsonResponse
    {
        $rapport = $this->trouverRapportUseCase->executer($id);

        if (!$rapport) {
            return response()->json([
                'message' => 'Rapport introuvable.'
            ], 404);
        }

        return response()->json($rapport);
    }
}