<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\FournisseurRepositoryInterface;
use App\Models\Fournisseur;

class CreerFournisseurUseCase
{
    public function __construct(
        private FournisseurRepositoryInterface $fournisseurRepository
    ) {
    }

    public function executer(array $donnees): Fournisseur
    {
        return $this->fournisseurRepository->creer($donnees);
    }
}