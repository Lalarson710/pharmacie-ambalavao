<?php

namespace App\Http\Controllers\Personnel;

use App\Application\Personnel\CreerUtilisateurUseCase;
use App\Application\Personnel\ListerUtilisateursUseCase;
use App\Application\Personnel\ModifierUtilisateurUseCase;
use App\Application\Personnel\SupprimerUtilisateurUseCase;
use App\Application\Personnel\TrouverUtilisateurUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class UtilisateurController
{
    public function __construct(
        private ListerUtilisateursUseCase $listerUtilisateursUseCase,
        private TrouverUtilisateurUseCase $trouverUtilisateurUseCase,
        private CreerUtilisateurUseCase $creerUtilisateurUseCase,
        private ModifierUtilisateurUseCase $modifierUtilisateurUseCase,
        private SupprimerUtilisateurUseCase $supprimerUtilisateurUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerUtilisateursUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $utilisateur = $this->trouverUtilisateurUseCase
            ->executer($id);

        if (!$utilisateur) {
            return response()->json([
                'message' => 'Utilisateur introuvable.'
            ], 404);
        }

        return response()->json($utilisateur);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        try {
            $utilisateur = $this->creerUtilisateurUseCase
                ->executer($donnees);

            return response()->json($utilisateur, 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $utilisateur = $this->trouverUtilisateurUseCase
            ->executer($id);

        if (!$utilisateur) {
            return response()->json([
                'message' => 'Utilisateur introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'password' => 'sometimes|string|min:8',
            'role_id' => 'sometimes|exists:roles,id',
        ]);

        try {
            $utilisateur = $this->modifierUtilisateurUseCase
                ->executer(
                    $utilisateur,
                    $donnees
                );

            // FEATURE 2 : Si mot de passe changé par l'utilisateur lui-même → déconnexion
            if (isset($donnees['password']) && $utilisateur->id === auth()->id()) {
                $utilisateur->tokens()->delete();

                return response()->json([
                    'message' => 'Mot de passe mis à jour. Déconnexion nécessaire.',
                ], 401);
            }

            return response()->json($utilisateur);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $utilisateur = $this->trouverUtilisateurUseCase
            ->executer($id);

        if (!$utilisateur) {
            return response()->json([
                'message' => 'Utilisateur introuvable.'
            ], 404);
        }

        try {
            $this->supprimerUtilisateurUseCase
                ->executer($utilisateur);

            return response()->json([
                'message' => 'Utilisateur supprimé avec succès.'
            ]);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}