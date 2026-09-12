<?php

namespace App\Application\Statistiques;

use App\Application\Statistiques\Ports\StatistiquesRepositoryInterface;

class ObtenirChiffreAffairesUseCase
{
    public function __construct(
        private StatistiquesRepositoryInterface $repository
    ) {
    }

    public function executer(
        string $dateDebut,
        string $dateFin
    ): array {
        return $this->repository->chiffreAffaires(
            $dateDebut,
            $dateFin
        );
    }
}