<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;
use App\Models\Produit;

class TrouverProduitUseCase
{
    public function __construct(
        private ProduitRepositoryInterface $produitRepository
    ) {
    }

    public function executer(int $id): ?Produit
    {
        return $this->produitRepository->trouverParId($id);
    }
}