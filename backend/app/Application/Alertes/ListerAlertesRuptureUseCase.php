<?php

namespace App\Application\Alertes;

use App\Application\Alertes\Ports\AlerteRepositoryInterface;

class ListerAlertesRuptureUseCase
{
    public function __construct(
        private AlerteRepositoryInterface $repository
    ) {
    }

    public function executer(): array
    {
        return $this->repository->ruptures();
    }
}