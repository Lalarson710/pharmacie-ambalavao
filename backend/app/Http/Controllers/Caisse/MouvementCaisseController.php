<?php

namespace App\Http\Controllers\Caisse;

use App\Application\Caisse\CreerMouvementCaisseUseCase;
use App\Application\Caisse\ListerMouvementsCaisseUseCase;
use App\Application\Caisse\TrouverMouvementCaisseUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class MouvementCaisseController
{
    public function __construct(
        private ListerMouvementsCaisseUseCase $listerMouvementsUseCase,
        private TrouverMouvementCaisseUseCase $trouverMouvementUseCase,
        private CreerMouvementCaisseUseCase $creerMouvementUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerMouvementsUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $mouvement = $this->trouverMouvementUseCase
            ->executer($id);

        if (!$mouvement) {
            return response()->json([
                'message' => 'Mouvement de caisse introuvable.'
            ], 404);
        }

        return response()->json($mouvement);
    }

    public function parCaisse(int $caisseId): JsonResponse
    {
        return response()->json(
            $this->listerMouvementsUseCase
                ->executerParCaisse($caisseId)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'caisse_id' => 'required|exists:caisses,id',
            'reglement_id' => 'nullable|exists:reglements,id',
            'type' => 'required|string|in:entree,sortie',
            'montant' => 'required|numeric|min:0.01',
            'motif' => 'nullable|string',
        ]);

        try {
            $mouvement = $this->creerMouvementUseCase
                ->executer($donnees);

            return response()->json($mouvement, 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}