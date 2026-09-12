<?php

namespace App\Application\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;

class SupprimerCategorieUseCase
{
    public function __construct(
        private CategorieRepositoryInterface $categorieRepository
    ) {
    }

    public function executer(int $id): bool
    {
        $categorie = $this->categorieRepository->trouverParId($id);

        if (!$categorie) {
            return false;
        }

        return $this->categorieRepository->supprimer($categorie);
    }
}