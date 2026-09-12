<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RoleRepositoryInterface;

class ListerPermissionsRoleUseCase
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {
    }

    public function executer(int $roleId): array
    {
        $role = $this->roleRepository->trouverParId($roleId);

        if (!$role) {
            throw new \RuntimeException('Rôle introuvable.');
        }

        return $role->permissions()
            ->orderBy('code')
            ->get()
            ->all();
    }
}