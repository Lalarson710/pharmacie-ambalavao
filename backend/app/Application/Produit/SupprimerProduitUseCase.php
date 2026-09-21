<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;

class SupprimerProduitUseCase
{
    public function __construct(
        private ProduitRepositoryInterface $produitRepository
    ) {
    }

    public function executer(int $id): ?string
    {
        $produit = $this->produitRepository->trouverParId($id);

        if (!$produit) {
            return null;
        }

        if ($produit->lots()->exists()) {
            return 'Ce produit ne peut pas être supprimé car il possède un ou plusieurs lots.';
        }

        if ($produit->ventesLignes()->exists()) {
            return 'Ce produit ne peut pas être supprimé car il est lié à une ou plusieurs ventes.';
        }

        return $this->produitRepository->supprimer($produit) ? 'ok' : null;
    }
}
