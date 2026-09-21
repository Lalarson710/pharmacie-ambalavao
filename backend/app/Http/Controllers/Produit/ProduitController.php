<?php

namespace App\Http\Controllers\Produit;

use App\Application\Produit\CreerProduitUseCase;
use App\Application\Produit\ListerProduitsUseCase;
use App\Application\Produit\TrouverProduitUseCase;
use App\Application\Produit\ModifierProduitUseCase;
use App\Application\Produit\SupprimerProduitUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProduitController extends Controller
{
    public function __construct(
        private ListerProduitsUseCase $listerProduitsUseCase,
        private TrouverProduitUseCase $trouverProduitUseCase,
        private CreerProduitUseCase $creerProduitUseCase,
        private ModifierProduitUseCase $modifierProduitUseCase,
        private SupprimerProduitUseCase $supprimerProduitUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $produits = $this->listerProduitsUseCase->executer();

        return response()->json($produits);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'categorie_id' => ['required', 'integer', 'exists:categories,id'],
            'unite_id' => ['required', 'integer', 'exists:unites,id'],
            'nom' => ['required', 'string', 'max:150'],
            'code_barres' => ['nullable', 'string', 'max:50', 'unique:produits,code_barres'],
            'description' => ['nullable', 'string'],
            'prix_achat' => ['required', 'numeric', 'min:0'],
            'prix_vente' => ['required', 'numeric', 'min:0'],
            'stock_minimum' => ['integer', 'min:0'],
            'actif' => ['boolean'],
        ]);

        $produit = $this->creerProduitUseCase->executer($donnees);

        return response()->json($produit, 201);
    }

    public function show(int $id): JsonResponse
    {
        $produit = $this->trouverProduitUseCase->executer($id);

        if (!$produit) {
            return response()->json([
                'message' => 'Produit introuvable.'
            ], 404);
        }

        return response()->json($produit);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $donnees = $request->validate([
            'categorie_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'unite_id' => ['sometimes', 'required', 'integer', 'exists:unites,id'],
            'nom' => ['sometimes', 'required', 'string', 'max:150'],
            'code_barres' => ['sometimes', 'nullable', 'string', 'max:50', 'unique:produits,code_barres,' . $id],
            'description' => ['sometimes', 'nullable', 'string'],
            'prix_achat' => ['sometimes', 'required', 'numeric', 'min:0'],
            'prix_vente' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock_minimum' => ['sometimes', 'integer', 'min:0'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $produit = $this->modifierProduitUseCase->executer($id, $donnees);

        if (!$produit) {
            return response()->json([
                'message' => 'Produit introuvable.'
            ], 404);
        }

        return response()->json($produit);
    }

    public function destroy(int $id): JsonResponse
    {
        $resultat = $this->supprimerProduitUseCase->executer($id);

        if ($resultat === null) {
            return response()->json([
                'message' => 'Produit introuvable.'
            ], 404);
        }

        if ($resultat === 'ok') {
            return response()->json([
                'message' => 'Produit supprimé avec succès.'
            ]);
        }

        return response()->json([
            'message' => $resultat
        ], 409);
    }

}