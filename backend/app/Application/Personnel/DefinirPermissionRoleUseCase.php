<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RolePermissionRepositoryInterface;

class DefinirPermissionRoleUseCase
{
    public function __construct(
        private RolePermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(
        int $roleId,
        int $permissionId
    ): void {
        $this->permissionRepository->definir(
            $roleId,
            $permissionId
        );
    }
}