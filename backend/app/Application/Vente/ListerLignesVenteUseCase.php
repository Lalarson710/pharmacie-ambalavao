<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteLigneRepositoryInterface;

class ListerLignesVenteUseCase
{
    public function __construct(
        private VenteLigneRepositoryInterface $venteLigneRepository
    ) {
    }

    public function executer(int $venteId): array
    {
        return $this->venteLigneRepository
            ->listerParVente($venteId);
    }
}