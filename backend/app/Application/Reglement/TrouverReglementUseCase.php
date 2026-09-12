<?php

namespace App\Application\Reglement;

use App\Application\Reglement\Ports\ReglementRepositoryInterface;
use App\Models\Reglement;

class TrouverReglementUseCase
{
    public function __construct(
        private ReglementRepositoryInterface $reglementRepository
    ) {
    }

    public function executer(int $id): ?Reglement
    {
        return $this->reglementRepository->trouverParId($id);
    }
}