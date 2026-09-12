<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RolePermissionRepositoryInterface;

class SupprimerPermissionRoleUseCase
{
    public function __construct(
        private RolePermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(
        int $roleId,
        int $permissionId
    ): bool {
        return $this->permissionRepository->supprimer(
            $roleId,
            $permissionId
        );
    }
}