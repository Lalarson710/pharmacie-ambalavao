<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\MouvementCaisseRepositoryInterface;

class ListerMouvementsCaisseUseCase
{
    public function __construct(
        private MouvementCaisseRepositoryInterface $mouvementRepository
    ) {
    }

    public function executer(): array
    {
        return $this->mouvementRepository->lister();
    }

    public function executerParCaisse(int $caisseId): array
    {
        return $this->mouvementRepository
            ->listerParCaisse($caisseId);
    }
}