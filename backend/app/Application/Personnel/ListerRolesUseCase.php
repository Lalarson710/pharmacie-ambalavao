<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\RoleRepositoryInterface;

class ListerRolesUseCase
{
    public function __construct(
        private RoleRepositoryInterface $roleRepository
    ) {
    }

    public function executer(): array
    {
        return $this->roleRepository->lister();
    }
}