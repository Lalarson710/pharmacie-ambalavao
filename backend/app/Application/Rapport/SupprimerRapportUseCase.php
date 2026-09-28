<?php

namespace App\Application\Rapport;

use App\Application\Rapport\Ports\RapportRepositoryInterface;
use App\Models\Rapport;
use RuntimeException;

class SupprimerRapportUseCase
{
    public function __construct(
        private RapportRepositoryInterface $rapportRepository
    ) {
    }

    public function executer(Rapport $rapport): void
    {
        $this->rapportRepository->supprimer($rapport);
    }
}