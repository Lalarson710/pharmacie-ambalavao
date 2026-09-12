<?php

namespace App\Application\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;
use App\Models\Categorie;

class CreerCategorieUseCase
{
    public function __construct(
        private CategorieRepositoryInterface $categorieRepository
    ) {
    }

    public function executer(array $donnees): Categorie
    {
        return $this->categorieRepository->creer($donnees);
    }
}