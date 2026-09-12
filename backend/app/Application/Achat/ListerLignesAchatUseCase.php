<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatLigneRepositoryInterface;

class ListerLignesAchatUseCase
{
    public function __construct(
        private AchatLigneRepositoryInterface $achatLigneRepository
    ) {
    }

    public function executer(int $achatId): array
    {
        return $this->achatLigneRepository->listerParAchat($achatId);
    }
}