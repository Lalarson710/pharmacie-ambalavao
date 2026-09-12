<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RoleRepositoryInterface;
use App\Models\Role;
use RuntimeException;

class SupprimerRoleUseCase
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {
    }

    public function executer(Role $role): bool
    {
        if ($role->users()->exists()) {
            throw new RuntimeException(
                'Impossible de supprimer ce rôle car il est utilisé par un utilisateur.'
            );
        }

        return $this->roleRepository->supprimer($role);
    }
}