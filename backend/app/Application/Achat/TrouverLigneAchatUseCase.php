<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatLigneRepositoryInterface;
use App\Models\AchatLigne;

class TrouverLigneAchatUseCase
{
    public function __construct(
        private AchatLigneRepositoryInterface $achatLigneRepository
    ) {
    }

    public function executer(int $id): ?AchatLigne
    {
        return $this->achatLigneRepository->trouverParId($id);
    }
}