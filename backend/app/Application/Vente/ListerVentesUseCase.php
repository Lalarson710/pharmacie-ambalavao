<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteRepositoryInterface;

class ListerVentesUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository
    ) {
    }

    public function executer(): array
    {
        return $this->venteRepository->lister();
    }
}