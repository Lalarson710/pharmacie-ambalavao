<?php

namespace App\Http\Controllers\Personnel;

use App\Application\Personnel\CreerPersonnelUseCase;
use App\Application\Personnel\ListerPersonnelUseCase;
use App\Application\Personnel\ModifierPersonnelUseCase;
use App\Application\Personnel\SupprimerPersonnelUseCase;
use App\Application\Personnel\TrouverPersonnelUseCase;
use App\Models\Personnel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PersonnelController
{
    public function __construct(
        private ListerPersonnelUseCase $listerPersonnelUseCase,
        private TrouverPersonnelUseCase $trouverPersonnelUseCase,
        private CreerPersonnelUseCase $creerPersonnelUseCase,
        private ModifierPersonnelUseCase $modifierPersonnelUseCase,
        private SupprimerPersonnelUseCase $supprimerPersonnelUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerPersonnelUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $personnel = $this->trouverPersonnelUseCase->executer($id);

        if (!$personnel) {
            return response()->json([
                'message' => 'Personnel introuvable.'
            ], 404);
        }

        return response()->json($personnel);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'user_id' => ['nullable', 'integer', 'exists:users,id', 'unique:personnels,user_id'],
            'nom' => ['required', 'string', 'max:100'],
            'prenom' => ['required', 'string', 'max:100'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150', 'unique:personnels,email'],
            'adresse' => ['nullable', 'string'],
            'fonction' => ['required', 'string', 'max:100'],
            'date_embauche' => ['nullable', 'date'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $personnel = $this->creerPersonnelUseCase->executer(
            $donnees
        );

        return response()->json($personnel, 201);
    }

    public function update(
        int $id,
        Request $request
    ): JsonResponse {
        $personnel = $this->trouverPersonnelUseCase->executer($id);

        if (!$personnel) {
            return response()->json([
                'message' => 'Personnel introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
                'unique:personnels,user_id,' . $id,
            ],
            'nom' => ['required', 'string', 'max:100'],
            'prenom' => ['required', 'string', 'max:100'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => [
                'nullable',
                'email',
                'max:150',
                'unique:personnels,email,' . $id,
            ],
            'adresse' => ['nullable', 'string'],
            'fonction' => ['required', 'string', 'max:100'],
            'date_embauche' => ['nullable', 'date'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $personnel = $this->modifierPersonnelUseCase->executer(
            $personnel,
            $donnees
        );

        return response()->json($personnel);
    }

    public function destroy(int $id): JsonResponse
    {
        $personnel = $this->trouverPersonnelUseCase->executer($id);

        if (!$personnel) {
            return response()->json([
                'message' => 'Personnel introuvable.'
            ], 404);
        }

        $this->supprimerPersonnelUseCase->executer($personnel);

        return response()->json([
            'message' => 'Personnel supprimé avec succès.'
        ]);
    }
}