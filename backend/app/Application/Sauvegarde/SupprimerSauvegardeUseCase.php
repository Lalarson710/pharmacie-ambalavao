<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;
use App\Models\Sauvegarde;
use RuntimeException;

class SupprimerSauvegardeUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $sauvegardeRepository
    ) {
    }

    public function executer(Sauvegarde $sauvegarde): void
    {
        $this->sauvegardeRepository->supprimer($sauvegarde);
    }
}