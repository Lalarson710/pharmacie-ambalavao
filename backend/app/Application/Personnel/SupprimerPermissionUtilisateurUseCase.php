<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserPermissionRepositoryInterface;

class SupprimerPermissionUtilisateurUseCase
{
    public function __construct(
        private UserPermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(
        int $userId,
        int $permissionId
    ): bool {
        return $this->permissionRepository->supprimer(
            $userId,
            $permissionId
        );
    }
}