<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\Achat;

class CreerAchatUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository
    ) {
    }

    public function executer(array $donnees): Achat
    {
        return $this->achatRepository->creer($donnees);
    }
}