<?php

namespace App\Http\Controllers\Categorie;

use App\Application\Categorie\CreerCategorieUseCase;
use App\Application\Categorie\ListerCategoriesUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Application\Categorie\TrouverCategorieUseCase;
use App\Application\Categorie\ModifierCategorieUseCase;
use App\Application\Categorie\SupprimerCategorieUseCase;

class CategorieController extends Controller
{
    public function __construct(
        private ListerCategoriesUseCase $listerCategoriesUseCase,
        private CreerCategorieUseCase $creerCategorieUseCase,
        private TrouverCategorieUseCase $trouverCategorieUseCase,
        private ModifierCategorieUseCase $modifierCategorieUseCase,
        private SupprimerCategorieUseCase $supprimerCategorieUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $categories = $this->listerCategoriesUseCase->executer();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'nom' => ['required', 'string', 'max:100', 'unique:categories,nom'],
            'description' => ['nullable', 'string'],
            'actif' => ['boolean'],
        ]);

        $categorie = $this->creerCategorieUseCase->executer($donnees);

        return response()->json($categorie, 201);
    }

    public function show(int $id): JsonResponse
    {
        $categorie = $this->trouverCategorieUseCase->executer($id);

        if (!$categorie) {
            return response()->json([
                'message' => 'Catégorie introuvable.'
            ], 404);
        }

        return response()->json($categorie);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $donnees = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:100', 'unique:categories,nom,' . $id],
            'description' => ['sometimes', 'nullable', 'string'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $categorie = $this->modifierCategorieUseCase->executer($id, $donnees);

        if (!$categorie) {
            return response()->json([
                'message' => 'Catégorie introuvable.'
            ], 404);
        }

        return response()->json($categorie);
    }

    public function destroy(int $id): JsonResponse
    {
        $resultat = $this->supprimerCategorieUseCase->executer($id);

        if ($resultat === null) {
            return response()->json([
                'message' => 'Catégorie introuvable.'
            ], 404);
        }

        if ($resultat === 'ok') {
            return response()->json([
                'message' => 'Catégorie supprimée avec succès.'
            ]);
        }

        return response()->json([
            'message' => $resultat
        ], 409);
    }

}