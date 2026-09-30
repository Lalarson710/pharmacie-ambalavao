<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;
use RuntimeException;

class SupprimerProduitConditionnementUseCase
{
    public function __construct(
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(int $id): mixed
    {
        $conditionnement = $this->conditionnementRepository->trouverParId($id);

        if (!$conditionnement) {
            return null;
        }

        // Empêcher la suppression de l'unité de base
        if ($conditionnement->est_unite_base) {
            return 'Impossible de supprimer l\'unité de base. Définissez d\'abord une autre unité comme base.';
        }

        // Vérifier si le conditionnement est utilisé dans des achats ou ventes
        if ($conditionnement->achatLignes()->exists() || $conditionnement->ventesLignes()->exists()) {
            return 'Impossible de supprimer ce conditionnement car il est utilisé dans des achats ou des ventes.';
        }

        $this->conditionnementRepository->supprimer($conditionnement);

        return 'ok';
    }
}