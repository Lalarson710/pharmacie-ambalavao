<?php

namespace App\Http\Controllers\Facture;

use App\Application\Facture\CreerFactureUseCase;
use App\Application\Facture\ListerFacturesUseCase;
use App\Application\Facture\ModifierFactureUseCase;
use App\Application\Facture\TrouverFactureUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class FactureController
{
    public function __construct(
        private ListerFacturesUseCase $listerFacturesUseCase,
        private TrouverFactureUseCase $trouverFactureUseCase,
        private CreerFactureUseCase $creerFactureUseCase,
        private ModifierFactureUseCase $modifierFactureUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerFacturesUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $facture = $this->trouverFactureUseCase->executer($id);

        if (!$facture) {
            return response()->json([
                'message' => 'Facture introuvable.'
            ], 404);
        }

        return response()->json($facture);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'vente_id' => 'required|exists:ventes,id|unique:factures,vente_id',
            'numero' => 'required|string|max:50|unique:factures,numero',
            'date_facture' => 'required|date',
            'montant_total' => 'required|numeric|min:0',
        ]);

        $donnees['statut'] = 'impayee';

        $facture = $this->creerFactureUseCase
            ->executer($donnees);

        return response()->json($facture, 201);
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $facture = $this->trouverFactureUseCase->executer($id);

        if (!$facture) {
            return response()->json([
                'message' => 'Facture introuvable.'
            ], 404);
        }

        try {
            $donnees = $request->validate([
                'date_facture' => 'sometimes|date',
                'statut' => 'sometimes|in:impayee,partiellement_payee,payee,annulee',
            ]);

            $facture = $this->modifierFactureUseCase
                ->executer($facture, $donnees);

            return response()->json($facture);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}