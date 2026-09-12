<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;

class CreerVenteUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository
    ) {
    }

    public function executer(array $donnees): Vente
    {
        return $this->venteRepository->creer($donnees);
    }
}