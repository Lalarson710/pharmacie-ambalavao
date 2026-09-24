<?php

namespace App\Http\Controllers\Achat;

use App\Application\Achat\AjouterLigneAchatUseCase;
use App\Application\Achat\ListerLignesAchatUseCase;
use App\Application\Achat\TrouverAchatUseCase;
use App\Application\Achat\TrouverLigneAchatUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Application\Achat\SupprimerLigneAchatUseCase;

class AchatLigneController extends Controller
{
    public function __construct(
        private ListerLignesAchatUseCase $listerLignesAchatUseCase,
        private TrouverLigneAchatUseCase $trouverLigneAchatUseCase,
        private AjouterLigneAchatUseCase $ajouterLigneAchatUseCase,
        private TrouverAchatUseCase $trouverAchatUseCase,
        private SupprimerLigneAchatUseCase $supprimerLigneAchatUseCase
    ) {
    }

    public function index(int $achatId): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($achatId);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        return response()->json(
            $this->listerLignesAchatUseCase->executer($achatId)
        );
    }

    public function show(int $id): JsonResponse
    {
        $ligne = $this->trouverLigneAchatUseCase->executer($id);

        if (!$ligne) {
            return response()->json([
                'message' => 'Ligne d’achat introuvable.'
            ], 404);
        }

        return response()->json($ligne);
    }

    public function store(
        Request $request,
        int $achatId
    ): JsonResponse {
        $achat = $this->trouverAchatUseCase->executer($achatId);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        if ($achat->statut !== 'brouillon') {
            return response()->json([
                'message' => 'Impossible d’ajouter une ligne à un achat qui n’est plus en brouillon.'
            ], 409);
        }

        $donnees = $request->validate([
            'produit_id' => [
                'required',
                'integer',
                'exists:produits,id'
            ],
            'numero_lot' => [
                'required',
                'string',
                'max:100'
            ],
            'date_peremption' => [
                'required',
                'date',
                'after:today'
            ],
            'quantite' => [
                'required',
                'integer',
                'min:1'
            ],
            'prix_unitaire' => [
                'required',
                'numeric',
                'min:0'
            ],
        ]);

        $donnees['achat_id'] = $achatId;

        $ligne = $this->ajouterLigneAchatUseCase
            ->executer($donnees);

        return response()->json($ligne, 201);
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $ligne = $this->trouverLigneAchatUseCase->executer($id);

        if (!$ligne) {
            return response()->json([
                'message' => 'Ligne d’achat introuvable.'
            ], 404);
        }

        $achat = $this->trouverAchatUseCase->executer($ligne->achat_id);

        if ($achat && $achat->statut !== 'brouillon') {
            return response()->json([
                'message' => 'Impossible de modifier une ligne d’un achat qui n’est plus en brouillon.'
            ], 409);
        }

        $donnes = $request->validate([
            'produit_id' => ['sometimes', 'required', 'integer', 'exists:produits,id'],
            'quantite' => ['sometimes', 'required', 'integer', 'min:1'],
            'prix_unitaire' => ['sometimes', 'required', 'numeric', 'min:0'],
            'numero_lot' => ['sometimes', 'nullable', 'string', 'max:100'],
            'date_peremption' => ['sometimes', 'nullable', 'date'],
        ]);

        // Recalculer le montant si quantité ou prix unitaire ont changé
        if (isset($donnes['quantite']) || isset($donnes['prix_unitaire'])) {
            $quantite = $donnes['quantite'] ?? $ligne->quantite;
            $prix = $donnes['prix_unitaire'] ?? $ligne->prix_unitaire;
            $donnes['montant'] = $quantite * $prix;
        }

        $ligne->fill($donnes);
        $ligne->save();

        return response()->json($ligne);
    }

    public function destroy(int $id): JsonResponse
    {
        $ligne = $this->trouverLigneAchatUseCase->executer($id);

        if (!$ligne) {
            return response()->json([
                'message' => 'Ligne d’achat introuvable.'
            ], 404);
        }

        try {
            $this->supprimerLigneAchatUseCase->executer($ligne);

            return response()->json([
                'message' => 'Ligne d’achat supprimée avec succès.'
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }       
}