<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteLigneRepositoryInterface;
use App\Models\VenteLigne;

class TrouverLigneVenteUseCase
{
    public function __construct(
        private VenteLigneRepositoryInterface $venteLigneRepository
    ) {
    }

    public function executer(int $id): ?VenteLigne
    {
        return $this->venteLigneRepository
            ->trouverParId($id);
    }
}