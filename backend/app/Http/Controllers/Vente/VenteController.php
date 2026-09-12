<?php

namespace App\Http\Controllers\Vente;

use App\Application\Vente\CreerVenteUseCase;
use App\Application\Vente\ListerVentesUseCase;
use App\Application\Vente\ModifierVenteUseCase;
use App\Application\Vente\SupprimerVenteUseCase;
use App\Application\Vente\TrouverVenteUseCase;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Vente;
use RuntimeException;

class VenteController
{
    public function __construct(
        private ListerVentesUseCase $listerVentesUseCase,
        private TrouverVenteUseCase $trouverVenteUseCase,
        private CreerVenteUseCase $creerVenteUseCase,
        private ModifierVenteUseCase $modifierVenteUseCase,
        private SupprimerVenteUseCase $supprimerVenteUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerVentesUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $vente = $this->trouverVenteUseCase->executer($id);

        if (!$vente) {
            return response()->json([
                'message' => 'Vente introuvable.'
            ], 404);
        }

        return response()->json($vente);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'numero' => 'required|string|max:50|unique:ventes,numero',
            'date_vente' => 'required|date',
            'client_id' => 'nullable|exists:clients,id',
            'observation' => 'nullable|string',
        ]);

        $donnees['montant_total'] = 0;
        $donnees['statut'] = 'brouillon';

        $vente = $this->creerVenteUseCase->executer($donnees);

        return response()->json($vente, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $vente = $this->trouverVenteUseCase->executer($id);

        if (!$vente) {
            return response()->json([
                'message' => 'Vente introuvable.'
            ], 404);
        }

        try {
            if ($vente->statut !== 'brouillon') {
                throw new RuntimeException(
                    'Impossible de modifier une vente qui n’est plus en brouillon.'
                );
            }

            $donnees = $request->validate([
                'numero' => 'sometimes|string|max:50|unique:ventes,numero,' . $id,
                'date_vente' => 'sometimes|date',
                'client_id' => 'nullable|exists:clients,id',
                'observation' => 'nullable|string',
            ]);

            $vente = $this->modifierVenteUseCase
                ->executer($vente, $donnees);

            return response()->json($vente);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $vente = $this->trouverVenteUseCase->executer($id);

        if (!$vente) {
            return response()->json([
                'message' => 'Vente introuvable.'
            ], 404);
        }

        try {
            $this->supprimerVenteUseCase->executer($vente);

            return response()->json([
                'message' => 'Vente supprimée avec succès.'
            ]);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function confirmer(int $id): JsonResponse
    {
        $vente = $this->trouverVenteUseCase->executer($id);

        if (!$vente) {
            return response()->json([
                'message' => 'Vente introuvable.'
            ], 404);
        }

        try {
            $confirmerVenteUseCase = app(
                \App\Application\Vente\ConfirmerVenteUseCase::class
            );

            $vente = $confirmerVenteUseCase->executer($vente);

            return response()->json([
                'message' => 'Vente confirmée avec succès.',
                'vente' => $vente
            ]);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}