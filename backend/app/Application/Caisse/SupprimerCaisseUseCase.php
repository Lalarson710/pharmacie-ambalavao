<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;
use App\Models\Caisse;
use RuntimeException;

class SupprimerCaisseUseCase
{
    public function __construct(
        private CaisseRepositoryInterface $caisseRepository
    ) {
    }

    public function executer(Caisse $caisse): void
    {
        $this->caisseRepository->supprimer($caisse);
    }
}