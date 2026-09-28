<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatStatutRepositoryInterface;
use App\Models\AchatStatut;
use RuntimeException;

class SupprimerAchatStatutUseCase
{
    public function __construct(
        private AchatStatutRepositoryInterface $achatStatutRepository
    ) {
    }

    public function executer(AchatStatut $achatStatut): void
    {
        $this->achatStatutRepository->supprimer($achatStatut);
    }
}