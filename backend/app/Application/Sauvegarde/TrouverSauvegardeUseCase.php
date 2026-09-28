<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;
use App\Models\Sauvegarde;

class TrouverSauvegardeUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $sauvegardeRepository
    ) {
    }

    public function executer(int $id): ?Sauvegarde
    {
        return $this->sauvegardeRepository->trouverParId($id);
    }
}