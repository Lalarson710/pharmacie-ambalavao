<?php

namespace App\Application\Statistiques;

use App\Application\Statistiques\Ports\StatistiquesRepositoryInterface;

class ObtenirStatistiquesVentesUseCase
{
    public function __construct(
        private StatistiquesRepositoryInterface $repository
    ) {
    }

    public function executer(
        string $dateDebut,
        string $dateFin
    ): array {
        return $this->repository->ventes($dateDebut, $dateFin);
    }
}