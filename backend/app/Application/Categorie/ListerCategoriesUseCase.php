<?php

namespace App\Application\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;

class ListerCategoriesUseCase
{
    public function __construct(
        private CategorieRepositoryInterface $categorieRepository
    ) {
    }

    public function executer(): array
    {
        return $this->categorieRepository->lister();
    }
}