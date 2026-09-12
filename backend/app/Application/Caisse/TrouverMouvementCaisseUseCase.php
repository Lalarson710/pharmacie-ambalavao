<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\MouvementCaisseRepositoryInterface;
use App\Models\MouvementCaisse;

class TrouverMouvementCaisseUseCase
{
    public function __construct(
        private MouvementCaisseRepositoryInterface $mouvementRepository
    ) {
    }

    public function executer(int $id): ?MouvementCaisse
    {
        return $this->mouvementRepository->trouverParId($id);
    }
}