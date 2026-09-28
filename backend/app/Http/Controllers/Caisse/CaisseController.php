<?php

namespace App\Http\Controllers\Caisse;

use App\Application\Caisse\FermerCaisseUseCase;
use App\Application\Caisse\ListerCaissesUseCase;
use App\Application\Caisse\ModifierCaisseUseCase;
use App\Application\Caisse\OuvrirCaisseUseCase;
use App\Application\Caisse\SupprimerCaisseUseCase;
use App\Application\Caisse\TrouverCaisseUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class CaisseController
{
    public function __construct(
        private ListerCaissesUseCase $listerCaissesUseCase,
        private TrouverCaisseUseCase $trouverCaisseUseCase,
        private OuvrirCaisseUseCase $ouvrirCaisseUseCase,
        private FermerCaisseUseCase $fermerCaisseUseCase,
        private ModifierCaisseUseCase $modifierCaisseUseCase,
        private SupprimerCaisseUseCase $supprimerCaisseUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerCaissesUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $caisse = $this->trouverCaisseUseCase->executer($id);

        if (!$caisse) {
            return response()->json([
                'message' => 'Caisse introuvable.'
            ], 404);
        }

        return response()->json($caisse);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'montant_initial' => 'required|numeric|min:0',
        ]);

        try {
            $caisse = $this->ouvrirCaisseUseCase->executer(
                $request->user()->id,
                (float) $donnees['montant_initial']
            );

            return response()->json($caisse, 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $caisse = $this->trouverCaisseUseCase->executer($id);

        if (!$caisse) {
            return response()->json([
                'message' => 'Caisse introuvable.'
            ], 404);
        }

        try {
            $donnees = $request->validate([
                'montant_initial' => 'sometimes|numeric|min:0',
            ]);

            $caisse = $this->modifierCaisseUseCase->executer($caisse, $donnees);

            return response()->json($caisse);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $caisse = $this->trouverCaisseUseCase->executer($id);

        if (!$caisse) {
            return response()->json([
                'message' => 'Caisse introuvable.'
            ], 404);
        }

        try {
            $this->supprimerCaisseUseCase->executer($caisse);

            return response()->json([
                'message' => 'Caisse supprimée avec succès.'
            ]);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function fermer(
        Request $request,
        int $id
    ): JsonResponse {
        $caisse = $this->trouverCaisseUseCase->executer($id);

        if (!$caisse) {
            return response()->json([
                'message' => 'Caisse introuvable.'
            ], 404);
        }

        try {
            $donnees = $request->validate([
                'montant_final' => 'required|numeric|min:0',
            ]);

            $caisse = $this->fermerCaisseUseCase->executer(
                $caisse,
                (float) $donnees['montant_final']
            );

            return response()->json($caisse);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function impression(int $id): JsonResponse
    {
        $caisse = $this->trouverCaisseUseCase->executer($id);

        if (!$caisse) {
            return response()->json([
                'message' => 'Caisse introuvable.'
            ], 404);
        }

        return response()->json($caisse);
    }
}