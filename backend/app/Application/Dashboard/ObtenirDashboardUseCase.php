<?php

namespace App\Application\Dashboard;

use App\Application\Dashboard\Ports\DashboardRepositoryInterface;

class ObtenirDashboardUseCase
{
    public function __construct(
        private DashboardRepositoryInterface $repository
    ) {
    }

    public function executer(): array
    {
        return $this->repository->obtenir();
    }
}