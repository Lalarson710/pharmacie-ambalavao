<?php

namespace App\Http\Controllers\Personnel;

use App\Application\Personnel\CreerRoleUseCase;
use App\Application\Personnel\DefinirPermissionRoleUseCase;
use App\Application\Personnel\ListerPermissionsRoleUseCase;
use App\Application\Personnel\ListerRolesUseCase;
use App\Application\Personnel\ModifierRoleUseCase;
use App\Application\Personnel\SupprimerPermissionRoleUseCase;
use App\Application\Personnel\SupprimerRoleUseCase;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController
{
    public function __construct(
        private ListerRolesUseCase $listerRolesUseCase,
        private ListerPermissionsRoleUseCase $listerPermissionsRoleUseCase,
        private DefinirPermissionRoleUseCase $definirPermissionRoleUseCase,
        private SupprimerPermissionRoleUseCase $supprimerPermissionRoleUseCase,
        private CreerRoleUseCase $creerRoleUseCase,
        private ModifierRoleUseCase $modifierRoleUseCase,
        private SupprimerRoleUseCase $supprimerRoleUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerRolesUseCase->executer()
        );
    }

    public function permissions(int $roleId): JsonResponse
    {
        return response()->json(
            $this->listerPermissionsRoleUseCase->executer($roleId)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'nom' => ['required', 'string', 'max:50', 'unique:roles,nom'],
            'nom_affichage' => ['required', 'string', 'max:100'],
        ]);

        $role = $this->creerRoleUseCase->executer($donnees);

        return response()->json($role, 201);
    }

    public function update(
        int $roleId,
        Request $request
    ): JsonResponse {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'message' => 'Rôle introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'nom' => [
                'required',
                'string',
                'max:50',
                'unique:roles,nom,' . $roleId,
            ],
            'nom_affichage' => [
                'required',
                'string',
                'max:100',
            ],
        ]);

        $role = $this->modifierRoleUseCase->executer(
            $role,
            $donnees
        );

        return response()->json($role);
    }

    public function destroy(int $roleId): JsonResponse
    {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json([
                'message' => 'Rôle introuvable.'
            ], 404);
        }

        try {
            $this->supprimerRoleUseCase->executer($role);

            return response()->json([
                'message' => 'Rôle supprimé avec succès.'
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function definirPermission(
        int $roleId,
        Request $request
    ): JsonResponse {
        $donnees = $request->validate([
            'permission_id' => [
                'required',
                'integer',
                'exists:permissions,id'
            ],
        ]);

        $this->definirPermissionRoleUseCase->executer(
            $roleId,
            $donnees['permission_id']
        );

        return response()->json([
            'message' => 'Permission ajoutée au rôle avec succès.'
        ]);
    }

    public function supprimerPermission(
        int $roleId,
        int $permissionId
    ): JsonResponse {
        $supprimee = $this->supprimerPermissionRoleUseCase
            ->executer(
                $roleId,
                $permissionId
            );

        if (!$supprimee) {
            return response()->json([
                'message' => 'Cette permission n’est pas attribuée à ce rôle.'
            ], 404);
        }

        return response()->json([
            'message' => 'Permission retirée du rôle avec succès.'
        ]);
    }
}