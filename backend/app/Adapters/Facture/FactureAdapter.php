<?php

namespace App\Adapters\Facture;

use App\Application\Facture\Ports\ImpressionFactureRepositoryInterface;

class FactureAdapter
{
    public function __construct(
        private ImpressionFactureRepositoryInterface $repository
    ) {}

    public function obtenirDonnees(int $factureId): ?array
    {
        return $this->repository->obtenirDonnees($factureId);
    }
}