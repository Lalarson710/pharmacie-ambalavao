<?php

namespace App\Application\Statistiques;

use App\Application\Statistiques\Ports\StatistiquesRepositoryInterface;

class ObtenirProduitsPlusVendusUseCase
{
    public function __construct(
        private StatistiquesRepositoryInterface $repository
    ) {
    }

    public function executer(
        string $dateDebut,
        string $dateFin
    ): array {
        return $this->repository->produitsPlusVendus(
            $dateDebut,
            $dateFin
        );
    }
}