<?php

namespace App\Application\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;
use App\Models\Categorie;

class TrouverCategorieUseCase
{
    public function __construct(
        private CategorieRepositoryInterface $categorieRepository
    ) {
    }

    public function executer(int $id): ?Categorie
    {
        return $this->categorieRepository->trouverParId($id);
    }
}