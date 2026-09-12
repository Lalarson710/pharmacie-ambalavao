<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PermissionRepositoryInterface;

class ListerPermissionsUseCase
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(): array
    {
        return $this->permissionRepository->lister();
    }
}