<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\Achat;

class TrouverAchatUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository
    ) {
    }

    public function executer(int $id): ?Achat
    {
        return $this->achatRepository->trouverParId($id);
    }
}