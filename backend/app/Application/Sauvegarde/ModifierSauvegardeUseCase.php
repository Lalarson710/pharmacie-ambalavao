<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;
use App\Models\Sauvegarde;

class ModifierSauvegardeUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $sauvegardeRepository
    ) {
    }

    public function executer(
        Sauvegarde $sauvegarde,
        array $donnees
    ): Sauvegarde {
        return $this->sauvegardeRepository->modifier(
            $sauvegarde,
            $donnees
        );
    }
}