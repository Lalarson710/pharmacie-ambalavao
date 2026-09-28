<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PermissionRepositoryInterface;
use App\Models\Permission;
use RuntimeException;

class SupprimerPermissionUseCase
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(Permission $permission): void
    {
        $this->permissionRepository->supprimer($permission);
    }
}