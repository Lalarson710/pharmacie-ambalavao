<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;
use App\Models\Caisse;

class ModifierCaisseUseCase
{
    public function __construct(
        private CaisseRepositoryInterface $caisseRepository
    ) {
    }

    public function executer(
        Caisse $caisse,
        array $donnees
    ): Caisse {
        return $this->caisseRepository->modifier(
            $caisse,
            $donnees
        );
    }
}