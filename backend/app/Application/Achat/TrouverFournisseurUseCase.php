<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\FournisseurRepositoryInterface;
use App\Models\Fournisseur;

class TrouverFournisseurUseCase
{
    public function __construct(
        private FournisseurRepositoryInterface $fournisseurRepository
    ) {
    }

    public function executer(int $id): ?Fournisseur
    {
        return $this->fournisseurRepository->trouverParId($id);
    }
}