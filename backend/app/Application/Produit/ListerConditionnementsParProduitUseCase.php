<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;

class ListerConditionnementsParProduitUseCase
{
    public function __construct(
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(int $produitId): array
    {
        return $this->conditionnementRepository->listerParProduit($produitId);
    }
}