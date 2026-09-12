<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserPermissionRepositoryInterface;

class DefinirPermissionUtilisateurUseCase
{
    public function __construct(
        private UserPermissionRepositoryInterface $permissionRepository
    ) {
    }

    public function executer(
        int $userId,
        int $permissionId,
        bool $autorise
    ): void {
        $this->permissionRepository->definir(
            $userId,
            $permissionId,
            $autorise
        );
    }
}