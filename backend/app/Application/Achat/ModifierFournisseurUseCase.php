<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\FournisseurRepositoryInterface;
use App\Models\Fournisseur;

class ModifierFournisseurUseCase
{
    public function __construct(
        private FournisseurRepositoryInterface $fournisseurRepository
    ) {
    }

    public function executer(
        Fournisseur $fournisseur,
        array $donnees
    ): Fournisseur {
        return $this->fournisseurRepository->modifier(
            $fournisseur,
            $donnees
        );
    }
}