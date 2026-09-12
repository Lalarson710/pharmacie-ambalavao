<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserPermissionRepositoryInterface;

class ListerPermissionsUtilisateurUseCase
{
    public function __construct(
        private UserPermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(int $userId): array
    {
        return $this->permissionRepository
            ->listerParUtilisateur($userId);
    }
}