<?php

namespace App\Adapters\Dashboard;

use App\Application\Dashboard\Ports\DashboardRepositoryInterface;

class DashboardAdapter
{
    public function __construct(
        private DashboardRepositoryInterface $repository
    ) {}

    public function obtenir(): array
    {
        return $this->repository->obtenir();
    }
}