<?php

namespace App\Http\Controllers\Rapport;

use App\Application\Rapport\CreerRapportUseCase;
use App\Application\Rapport\ListerRapportsUseCase;
use App\Application\Rapport\TrouverRapportUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class RapportController
{
    public function __construct(
        private ListerRapportsUseCase $listerRapportsUseCase,
        private TrouverRapportUseCase $trouverRapportUseCase,
        private CreerRapportUseCase $creerRapportUseCase
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
}