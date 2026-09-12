<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;
use App\Models\Produit;

class CreerProduitUseCase
{
    public function __construct(
        private ProduitRepositoryInterface $produitRepository
    ) {
    }

    public function executer(array $donnees): Produit
    {
        return $this->produitRepository->creer($donnees);
    }
}