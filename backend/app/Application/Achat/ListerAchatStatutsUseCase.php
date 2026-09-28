<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatStatutRepositoryInterface;

class ListerAchatStatutsUseCase
{
    public function __construct(
        private AchatStatutRepositoryInterface $achatStatutRepository
    ) {
    }

    public function executer(): array
    {
        return $this->achatStatutRepository->lister();
    }
}