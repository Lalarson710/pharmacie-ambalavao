<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RoleRepositoryInterface;
use App\Models\Role;

class CreerRoleUseCase
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {
    }

    public function executer(array $donnees): Role
    {
        return $this->roleRepository->creer($donnees);
    }
}