<?php

namespace App\Application\Alertes;

use App\Application\Alertes\Ports\AlerteRepositoryInterface;

class ListerAlertesPeremptionUseCase
{
    public function __construct(
        private AlerteRepositoryInterface $repository
    ) {
    }

    public function executer(int $jours = 30): array
    {
        return $this->repository->peremptions($jours);
    }
}