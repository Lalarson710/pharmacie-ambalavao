<?php

namespace App\Application\Facture;

use App\Application\Facture\Ports\FactureRepositoryInterface;

class ListerFacturesUseCase
{
    public function __construct(
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(): array
    {
        return $this->factureRepository->lister();
    }
}