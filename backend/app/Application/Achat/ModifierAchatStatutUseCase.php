<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatStatutRepositoryInterface;
use App\Models\AchatStatut;

class ModifierAchatStatutUseCase
{
    public function __construct(
        private AchatStatutRepositoryInterface $achatStatutRepository
    ) {
    }

    public function executer(
        AchatStatut $achatStatut,
        array $donnees
    ): AchatStatut {
        return $this->achatStatutRepository->modifier(
            $achatStatut,
            $donnees
        );
    }
}