<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PermissionRepositoryInterface;
use App\Models\Permission;

class CreerPermissionUseCase
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(array $donnees): Permission
    {
        return $this->permissionRepository->creer($donnees);
    }
}