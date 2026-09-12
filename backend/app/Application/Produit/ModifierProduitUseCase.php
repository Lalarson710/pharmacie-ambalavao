<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;
use App\Models\Produit;

class ModifierProduitUseCase
{
    public function __construct(
        private ProduitRepositoryInterface $produitRepository
    ) {
    }

    public function executer(int $id, array $donnees): ?Produit
    {
        $produit = $this->produitRepository->trouverParId($id);

        if (!$produit) {
            return null;
        }

        return $this->produitRepository->modifier(
            $produit,
            $donnees
        );
    }
}