<?php

namespace App\Http\Controllers\Produit;

use App\Application\Produit\CreerProduitConditionnementUseCase;
use App\Application\Produit\ListerConditionnementsParProduitUseCase;
use App\Application\Produit\ListerProduitConditionnementsUseCase;
use App\Application\Produit\ModifierProduitConditionnementUseCase;
use App\Application\Produit\SupprimerProduitConditionnementUseCase;
use App\Application\Produit\TrouverProduitConditionnementUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProduitConditionnementController extends Controller
{
    public function __construct(
        private ListerProduitConditionnementsUseCase $listerConditionnementsUseCase,
        private ListerConditionnementsParProduitUseCase $listerParProduitUseCase,
        private TrouverProduitConditionnementUseCase $trouverConditionnementUseCase,
        private CreerProduitConditionnementUseCase $creerConditionnementUseCase,
        private ModifierProduitConditionnementUseCase $modifierConditionnementUseCase,
        private SupprimerProduitConditionnementUseCase $supprimerConditionnementUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $conditionnements = $this->listerConditionnementsUseCase->executer();

        return response()->json($conditionnements);
    }

    public function parProduit(int $produitId): JsonResponse
    {
        $conditionnements = $this->listerParProduitUseCase->executer($produitId);

        return response()->json($conditionnements);
    }

    public function show(int $id): JsonResponse
    {
        $conditionnement = $this->trouverConditionnementUseCase->executer($id);

        if (!$conditionnement) {
            return response()->json([
                'message' => 'Conditionnement introuvable.'
            ], 404);
        }

        return response()->json($conditionnement);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'produit_id' => ['required', 'integer', 'exists:produits,id'],
            'unite_id' => ['required', 'integer', 'exists:unites,id'],
            'quantite_base' => ['required', 'integer', 'min:1'],
            'prix_vente' => ['required', 'numeric', 'min:0'],
            'code_barres' => ['nullable', 'string', 'max:50'],
            'est_unite_base' => ['sometimes', 'boolean'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        try {
            $conditionnement = $this->creerConditionnementUseCase->executer($donnees);

            return response()->json($conditionnement, 201);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $donnees = $request->validate([
            'unite_id' => ['sometimes', 'required', 'integer', 'exists:unites,id'],
            'quantite_base' => ['sometimes', 'required', 'integer', 'min:1'],
            'prix_vente' => ['sometimes', 'required', 'numeric', 'min:0'],
            'code_barres' => ['sometimes', 'nullable', 'string', 'max:50'],
            'est_unite_base' => ['sometimes', 'boolean'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        try {
            $conditionnement = $this->modifierConditionnementUseCase->executer($id, $donnees);

            if ($conditionnement === null) {
                return response()->json([
                    'message' => 'Conditionnement introuvable.'
                ], 404);
            }

            if (is_string($conditionnement)) {
                return response()->json([
                    'message' => $conditionnement
                ], 422);
            }

            return response()->json($conditionnement);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $resultat = $this->supprimerConditionnementUseCase->executer($id);

        if ($resultat === null) {
            return response()->json([
                'message' => 'Conditionnement introuvable.'
            ], 404);
        }

        if ($resultat === 'ok') {
            return response()->json([
                'message' => 'Conditionnement supprimé avec succès.'
            ]);
        }

        return response()->json([
            'message' => $resultat
        ], 409);
    }
}