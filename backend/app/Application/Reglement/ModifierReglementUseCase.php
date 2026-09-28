<?php

namespace App\Application\Reglement;

use App\Application\Reglement\Ports\ReglementRepositoryInterface;
use App\Models\Reglement;

class ModifierReglementUseCase
{
    public function __construct(
        private ReglementRepositoryInterface $reglementRepository
    ) {
    }

    public function executer(
        Reglement $reglement,
        array $donnees
    ): Reglement {
        return $this->reglementRepository->modifier(
            $reglement,
            $donnees
        );
    }
}