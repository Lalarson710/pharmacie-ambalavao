<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;

class SupprimerProduitUseCase
{
    public function __construct(
        private ProduitRepositoryInterface $produitRepository
    ) {
    }

    public function executer(int $id): bool
    {
        $produit = $this->produitRepository->trouverParId($id);

        if (!$produit) {
            return false;
        }

        return $this->produitRepository->supprimer($produit);
    }
}