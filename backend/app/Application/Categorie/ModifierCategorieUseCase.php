<?php

namespace App\Application\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;
use App\Models\Categorie;

class ModifierCategorieUseCase
{
    public function __construct(
        private CategorieRepositoryInterface $categorieRepository
    ) {
    }

    public function executer(int $id, array $donnees): ?Categorie
    {
        $categorie = $this->categorieRepository->trouverParId($id);

        if (!$categorie) {
            return null;
        }

        return $this->categorieRepository->modifier(
            $categorie,
            $donnees
        );
    }
}