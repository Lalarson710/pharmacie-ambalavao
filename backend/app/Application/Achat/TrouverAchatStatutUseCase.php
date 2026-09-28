<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatStatutRepositoryInterface;
use App\Models\AchatStatut;

class TrouverAchatStatutUseCase
{
    public function __construct(
        private AchatStatutRepositoryInterface $achatStatutRepository
    ) {
    }

    public function executer(int $id): ?AchatStatut
    {
        return $this->achatStatutRepository->trouverParId($id);
    }
}