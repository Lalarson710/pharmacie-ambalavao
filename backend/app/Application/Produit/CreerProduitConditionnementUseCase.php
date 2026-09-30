<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CreerProduitConditionnementUseCase
{
    public function __construct(
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(array $donnees): ProduitConditionnement
    {
        return DB::transaction(function () use ($donnees) {
            $produitId = $donnees['produit_id'];
            $uniteId = $donnees['unite_id'];

            // Vérifier qu'il n'y a pas déjà un conditionnement pour ce produit et cette unité
            $existant = $this->conditionnementRepository->trouverParProduitEtUnite($produitId, $uniteId);
            if ($existant) {
                throw new RuntimeException('Ce produit possède déjà un conditionnement pour cette unité.');
            }

            // Si c'est l'unité de base, s'assurer qu'il n'y en a qu'une seule
            if (!empty($donnees['est_unite_base']) && $donnees['est_unite_base']) {
                $uniteBaseExistante = $this->conditionnementRepository->getUniteBase($produitId);
                if ($uniteBaseExistante) {
                    throw new RuntimeException('Ce produit possède déjà une unité de base définie.');
                }
            }

            // Si c'est le premier conditionnement, le marquer comme unité de base
            $conditionnements = $this->conditionnementRepository->listerParProduit($produitId);
            if (empty($conditionnements)) {
                $donnees['est_unite_base'] = true;
            }

            return $this->conditionnementRepository->creer($donnees);
        });
    }
}