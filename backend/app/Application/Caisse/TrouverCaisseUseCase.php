<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;
use App\Models\Caisse;

class TrouverCaisseUseCase
{
    public function __construct(
        private CaisseRepositoryInterface $caisseRepository
    ) {
    }

    public function executer(int $id): ?Caisse
    {
        return $this->caisseRepository->trouverParId($id);
    }
}