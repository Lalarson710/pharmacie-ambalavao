<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatStatutRepositoryInterface;
use App\Models\AchatStatut;

class CreerAchatStatutUseCase
{
    public function __construct(
        private AchatStatutRepositoryInterface $achatStatutRepository
    ) {
    }

    public function executer(array $donnees): AchatStatut
    {
        return $this->achatStatutRepository->creer($donnees);
    }
}