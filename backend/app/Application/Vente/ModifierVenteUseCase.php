<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;

class ModifierVenteUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository
    ) {
    }

    public function executer(
        Vente $vente,
        array $donnees
    ): Vente {
        return $this->venteRepository->modifier(
            $vente,
            $donnees
        );
    }
}