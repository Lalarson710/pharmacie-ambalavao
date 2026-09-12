<?php

namespace App\Application\Rapport;

use App\Application\Rapport\Ports\RapportRepositoryInterface;

class ListerRapportsUseCase
{
    public function __construct(
        private RapportRepositoryInterface $rapportRepository
    ) {
    }

    public function executer(): array
    {
        return $this->rapportRepository->lister();
    }
}