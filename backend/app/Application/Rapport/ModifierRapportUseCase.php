<?php

namespace App\Application\Rapport;

use App\Application\Rapport\Ports\RapportRepositoryInterface;
use App\Models\Rapport;

class ModifierRapportUseCase
{
    public function __construct(
        private RapportRepositoryInterface $rapportRepository
    ) {
    }

    public function executer(
        Rapport $rapport,
        array $donnees
    ): Rapport {
        return $this->rapportRepository->modifier(
            $rapport,
            $donnees
        );
    }
}