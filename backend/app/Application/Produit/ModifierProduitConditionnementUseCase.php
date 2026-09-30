<?php

namespace App\Application\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ModifierProduitConditionnementUseCase
{
    public function __construct(
        private ProduitConditionnementRepositoryInterface $conditionnementRepository
    ) {
    }

    public function executer(int $id, array $donnees): ?ProduitConditionnement
    {
        return DB::transaction(function () use ($id, $donnees) {
            $conditionnement = $this->conditionnementRepository->trouverParId($id);

            if (!$conditionnement) {
                return null;
            }

            // Si on change l'unité, vérifier qu'il n'y a pas de conflit
            if (isset($donnees['unite_id']) && $donnees['unite_id'] !== $conditionnement->unite_id) {
                $existant = $this->conditionnementRepository->trouverParProduitEtUnite(
                    $conditionnement->produit_id,
                    $donnees['unite_id']
                );
                if ($existant && $existant->id !== $id) {
                    throw new RuntimeException('Ce produit possède déjà un conditionnement pour cette unité.');
                }
            }

            // Gestion de l'unité de base
            if (isset($donnees['est_unite_base']) && $donnees['est_unite_base']) {
                $uniteBaseExistante = $this->conditionnementRepository->getUniteBase($conditionnement->produit_id);
                if ($uniteBaseExistante && $uniteBaseExistante->id !== $id) {
                    throw new RuntimeException('Ce produit possède déjà une unité de base définie.');
                }
            }

            // Empêcher de désactiver l'unité de base si c'est la seule
            if (isset($donnees['est_unite_base']) && !$donnees['est_unite_base'] && $conditionnement->est_unite_base) {
                throw new RuntimeException('Impossible de désactiver l\'unité de base. Définissez d\'abord une autre unité comme base.');
            }

            return $this->conditionnementRepository->modifier($conditionnement, $donnees);
        });
    }
}