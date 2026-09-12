<?php

namespace App\Application\Facture;

use App\Application\Facture\Ports\ImpressionFactureRepositoryInterface;

class GenererImpressionFactureUseCase
{
    public function __construct(
        private ImpressionFactureRepositoryInterface $repository
    ) {
    }

    public function executer(int $factureId): ?array
    {
        return $this->repository->obtenirDonnees($factureId);
    }
}