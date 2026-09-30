<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;

class ListerProduitConditionnementsUseCase
{
    public function __construct(
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(): array
    {
        return $this->conditionnementRepository->lister();
    }
}