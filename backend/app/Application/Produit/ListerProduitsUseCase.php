<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;

class ListerProduitsUseCase
{
    public function __construct(
        private ProduitRepositoryInterface $produitRepository
    ) {
    }

    public function executer(): array
    {
        return $this->produitRepository->lister();
    }
}