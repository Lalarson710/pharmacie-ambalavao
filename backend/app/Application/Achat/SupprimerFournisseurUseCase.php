<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\FournisseurRepositoryInterface;
use App\Models\Fournisseur;

class SupprimerFournisseurUseCase
{
    public function __construct(
        private FournisseurRepositoryInterface $fournisseurRepository
    ) {
    }

    public function executer(Fournisseur $fournisseur): bool
    {
        return $this->fournisseurRepository->supprimer($fournisseur);
    }
}