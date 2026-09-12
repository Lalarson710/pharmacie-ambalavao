<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;

class TrouverVenteUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository
    ) {
    }

    public function executer(int $id): ?Vente
    {
        return $this->venteRepository->trouverParId($id);
    }
}