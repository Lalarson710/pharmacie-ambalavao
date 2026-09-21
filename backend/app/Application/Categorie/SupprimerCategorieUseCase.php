<?php

namespace App\Application\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;

class SupprimerCategorieUseCase
{
    public function __construct(
        private CategorieRepositoryInterface $categorieRepository
    ) {
    }

    public function executer(int $id): ?string
    {
        $categorie = $this->categorieRepository->trouverParId($id);

        if (!$categorie) {
            return null;
        }

        if ($categorie->produits()->exists()) {
            return 'Cette catégorie ne peut pas être supprimée car elle est utilisée par un ou plusieurs produits.';
        }

        return $this->categorieRepository->supprimer($categorie) ? 'ok' : null;
    }
}
