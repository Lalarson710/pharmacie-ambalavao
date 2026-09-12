<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;

class ListerCaissesUseCase
{
    public function __construct(
        private CaisseRepositoryInterface $caisseRepository
    ) {
    }

    public function executer(): array
    {
        return $this->caisseRepository->lister();
    }
}