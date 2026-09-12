<?php

namespace App\Application\Reglement;

use App\Application\Reglement\Ports\ReglementRepositoryInterface;

class ListerReglementsUseCase
{
    public function __construct(
        private ReglementRepositoryInterface $reglementRepository
    ) {
    }

    public function executer(): array
    {
        return $this->reglementRepository->lister();
    }
}