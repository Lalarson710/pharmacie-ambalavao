<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RoleRepositoryInterface;
use App\Models\Role;

class ModifierRoleUseCase
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {
    }

    public function executer(
        Role $role,
        array $donnees
    ): Role {
        return $this->roleRepository->modifier(
            $role,
            $donnees
        );
    }
}