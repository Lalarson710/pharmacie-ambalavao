<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\FournisseurRepositoryInterface;

class ListerFournisseursUseCase
{
    public function __construct(
        private FournisseurRepositoryInterface $fournisseurRepository
    ) {
    }

    public function executer(): array
    {
        return $this->fournisseurRepository->lister();
    }
}