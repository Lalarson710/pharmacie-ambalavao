<?php

namespace App\Http\Controllers\Reglement;

use App\Application\Reglement\EnregistrerReglementUseCase;
use App\Application\Reglement\ListerReglementsUseCase;
use App\Application\Reglement\TrouverReglementUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class ReglementController
{
    public function __construct(
        private ListerReglementsUseCase $listerReglementsUseCase,
        private TrouverReglementUseCase $trouverReglementUseCase,
        private EnregistrerReglementUseCase $enregistrerReglementUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerReglementsUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $reglement = $this->trouverReglementUseCase
            ->executer($id);

        if (!$reglement) {
            return response()->json([
                'message' => 'Règlement introuvable.'
            ], 404);
        }

        return response()->json($reglement);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'facture_id' => 'required|exists:factures,id',
            'montant' => 'required|numeric|min:0.01',
            'mode' => 'required|string|max:30',
            'date_reglement' => 'required|date',
            'reference' => 'nullable|string',
        ]);

        try {
            $reglement = $this->enregistrerReglementUseCase
            ->executer(
                $donnees,
                $request->user()->id
            );

            return response()->json($reglement, 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}