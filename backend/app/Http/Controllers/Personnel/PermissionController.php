<?php

namespace App\Http\Controllers\Personnel;

use App\Application\Personnel\CreerPermissionUseCase;
use App\Application\Personnel\ListerPermissionsUseCase;
use App\Application\Personnel\ModifierPermissionUseCase;
use App\Application\Personnel\SupprimerPermissionUseCase;
use App\Application\Personnel\TrouverPermissionUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController
{
    public function __construct(
        private ListerPermissionsUseCase $listerPermissionsUseCase,
        private TrouverPermissionUseCase $trouverPermissionUseCase,
        private CreerPermissionUseCase $creerPermissionUseCase,
        private ModifierPermissionUseCase $modifierPermissionUseCase,
        private SupprimerPermissionUseCase $supprimerPermissionUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerPermissionsUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $permission = $this->trouverPermissionUseCase->executer($id);

        if (!$permission) {
            return response()->json([
                'message' => 'Permission introuvable.'
            ], 404);
        }

        return response()->json($permission);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'code' => 'required|string|max:100|unique:permissions,code',
            'nom' => 'required|string|max:255',
        ]);

        $permission = $this->creerPermissionUseCase->executer($donnees);

        return response()->json($permission, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $permission = $this->trouverPermissionUseCase->executer($id);

        if (!$permission) {
            return response()->json([
                'message' => 'Permission introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'code' => 'sometimes|string|max:100|unique:permissions,code,' . $id,
            'nom' => 'sometimes|string|max:255',
        ]);

        $permission = $this->modifierPermissionUseCase->executer($permission, $donnees);

        return response()->json($permission);
    }

    public function destroy(int $id): JsonResponse
    {
        $permission = $this->trouverPermissionUseCase->executer($id);

        if (!$permission) {
            return response()->json([
                'message' => 'Permission introuvable.'
            ], 404);
        }

        $this->supprimerPermissionUseCase->executer($permission);

        return response()->json([
            'message' => 'Permission supprimée avec succès.'
        ]);
    }
}