<?php

namespace App\Adapters\Statistiques;

use App\Application\Statistiques\Ports\StatistiquesRepositoryInterface;

class StatistiquesAdapter
{
    public function __construct(
        private StatistiquesRepositoryInterface $repository
    ) {}

    public function ventes(
        string $dateDebut,
        string $dateFin
    ): array {
        return $this->repository->ventes(
            $dateDebut,
            $dateFin
        );
    }

    public function produitsPlusVendus(
        string $dateDebut,
        string $dateFin
    ): array {
        return $this->repository->produitsPlusVendus(
            $dateDebut,
            $dateFin
        );
    }

    public function chiffreAffaires(
        string $dateDebut,
        string $dateFin
    ): array {
        return $this->repository->chiffreAffaires(
            $dateDebut,
            $dateFin
        );
    }
}