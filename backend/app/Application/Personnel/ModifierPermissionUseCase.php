<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PermissionRepositoryInterface;
use App\Models\Permission;

class ModifierPermissionUseCase
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(
        Permission $permission,
        array $donnees
    ): Permission {
        return $this->permissionRepository->modifier(
            $permission,
            $donnees
        );
    }
}