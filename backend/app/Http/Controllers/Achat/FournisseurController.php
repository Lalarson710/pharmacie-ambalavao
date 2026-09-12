<?php

namespace App\Http\Controllers\Achat;

use App\Application\Achat\CreerFournisseurUseCase;
use App\Application\Achat\ListerFournisseursUseCase;
use App\Application\Achat\ModifierFournisseurUseCase;
use App\Application\Achat\SupprimerFournisseurUseCase;
use App\Application\Achat\TrouverFournisseurUseCase;
use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    public function __construct(
        private ListerFournisseursUseCase $listerFournisseursUseCase,
        private TrouverFournisseurUseCase $trouverFournisseurUseCase,
        private CreerFournisseurUseCase $creerFournisseurUseCase,
        private ModifierFournisseurUseCase $modifierFournisseurUseCase,
        private SupprimerFournisseurUseCase $supprimerFournisseurUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerFournisseursUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $fournisseur = $this->trouverFournisseurUseCase->executer($id);

        if (!$fournisseur) {
            return response()->json([
                'message' => 'Fournisseur introuvable.'
            ], 404);
        }

        return response()->json($fournisseur);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'nom' => ['required', 'string', 'max:150'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string'],
            'actif' => ['boolean'],
        ]);

        $fournisseur = $this->creerFournisseurUseCase
            ->executer($donnees);

        return response()->json($fournisseur, 201);
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $fournisseur = $this->trouverFournisseurUseCase->executer($id);

        if (!$fournisseur) {
            return response()->json([
                'message' => 'Fournisseur introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:150'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string'],
            'actif' => ['boolean'],
        ]);

        $fournisseur = $this->modifierFournisseurUseCase
            ->executer($fournisseur, $donnees);

        return response()->json($fournisseur);
    }

    public function destroy(int $id): JsonResponse
    {
        $fournisseur = $this->trouverFournisseurUseCase->executer($id);

        if (!$fournisseur) {
            return response()->json([
                'message' => 'Fournisseur introuvable.'
            ], 404);
        }

        try {
            $this->supprimerFournisseurUseCase
                ->executer($fournisseur);

            return response()->json([
                'message' => 'Fournisseur supprimé avec succès.'
            ]);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Impossible de supprimer ce fournisseur car il est utilisé dans un achat.'
            ], 409);
        }
    }
}