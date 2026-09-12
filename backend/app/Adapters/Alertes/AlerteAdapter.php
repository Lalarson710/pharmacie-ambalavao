<?php

namespace App\Adapters\Alertes;

use App\Application\Alertes\Ports\AlerteRepositoryInterface;

class AlerteAdapter
{
    public function __construct(
        private AlerteRepositoryInterface $repository
    ) {}

    public function toutes(int $jours = 30): array
    {
        return $this->repository->toutes($jours);
    }
}