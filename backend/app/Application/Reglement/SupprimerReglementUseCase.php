<?php

namespace App\Application\Reglement;

use App\Application\Reglement\Ports\ReglementRepositoryInterface;
use App\Models\Reglement;
use RuntimeException;

class SupprimerReglementUseCase
{
    public function __construct(
        private ReglementRepositoryInterface $reglementRepository
    ) {
    }

    public function executer(Reglement $reglement): void
    {
        $this->reglementRepository->supprimer($reglement);
    }
}