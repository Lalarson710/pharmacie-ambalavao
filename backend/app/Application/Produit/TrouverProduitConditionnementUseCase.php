<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;

class TrouverProduitConditionnementUseCase
{
    public function __construct(
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(int $id): ?ProduitConditionnement
    {
        return $this->conditionnementRepository->trouverParId($id);
    }
}