<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PermissionRepositoryInterface;
use App\Models\Permission;

class TrouverPermissionUseCase
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(int $id): ?Permission
    {
        return $this->permissionRepository->trouverParId($id);
    }
}