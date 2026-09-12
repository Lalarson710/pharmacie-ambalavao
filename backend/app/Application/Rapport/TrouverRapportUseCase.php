<?php

namespace App\Application\Rapport;

use App\Application\Rapport\Ports\RapportRepositoryInterface;
use App\Models\Rapport;

class TrouverRapportUseCase
{
    public function __construct(
        private RapportRepositoryInterface $rapportRepository
    ) {
    }

    public function executer(int $id): ?Rapport
    {
        return $this->rapportRepository->trouverParId($id);
    }
}