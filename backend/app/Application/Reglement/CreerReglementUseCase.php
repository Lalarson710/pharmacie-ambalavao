<?php

namespace App\Application\Reglement;

use App\Application\Reglement\Ports\ReglementRepositoryInterface;
use App\Models\Reglement;

class CreerReglementUseCase
{
    public function __construct(
        private ReglementRepositoryInterface $reglementRepository
    ) {
    }

    public function executer(array $donnees): Reglement
    {
        return $this->reglementRepository->creer($donnees);
    }
}