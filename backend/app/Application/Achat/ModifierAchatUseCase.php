<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\Achat;

class ModifierAchatUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository
    ) {
    }

    public function executer(
        Achat $achat,
        array $donnees
    ): Achat {
        return $this->achatRepository->modifier(
            $achat,
            $donnees
        );
    }
}