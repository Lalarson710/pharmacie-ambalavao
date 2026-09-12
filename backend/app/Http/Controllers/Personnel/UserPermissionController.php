<?php

namespace App\Http\Controllers\Personnel;

use App\Application\Personnel\DefinirPermissionUtilisateurUseCase;
use App\Application\Personnel\ListerPermissionsUtilisateurUseCase;
use App\Application\Personnel\SupprimerPermissionUtilisateurUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserPermissionController
{
    public function __construct(
        private ListerPermissionsUtilisateurUseCase $listerPermissionsUseCase,
        private DefinirPermissionUtilisateurUseCase $definirPermissionUseCase,
        private SupprimerPermissionUtilisateurUseCase $supprimerPermissionUseCase
    ) {
    }

    public function index(int $userId): JsonResponse
    {
        return response()->json(
            $this->listerPermissionsUseCase
                ->executer($userId)
        );
    }

    public function definir(
        Request $request,
        int $userId
    ): JsonResponse {
        $donnees = $request->validate([
            'permission_id' => 'required|exists:permissions,id',
            'autorise' => 'required|boolean',
        ]);

        $this->definirPermissionUseCase->executer(
            $userId,
            (int) $donnees['permission_id'],
            (bool) $donnees['autorise']
        );

        return response()->json([
            'message' => 'Permission utilisateur mise à jour avec succès.'
        ]);
    }

    public function supprimer(
        int $userId,
        int $permissionId
    ): JsonResponse {
        $supprimee = $this->supprimerPermissionUseCase
            ->executer($userId, $permissionId);

        if (!$supprimee) {
            return response()->json([
                'message' => 'Permission individuelle introuvable.'
            ], 404);
        }

        return response()->json([
            'message' => 'Permission individuelle supprimée avec succès.'
        ]);
    }
}