<?php

namespace App\Application\Caisse;

use App\Application\Caisse\Ports\MouvementCaisseRepositoryInterface;
use App\Models\MouvementCaisse;
use RuntimeException;

class CreerMouvementCaisseUseCase
{
    public function __construct(
        private MouvementCaisseRepositoryInterface $mouvementRepository
    ) {
    }

    public function executer(array $donnees): MouvementCaisse
    {
        if ($donnees['montant'] <= 0) {
            throw new RuntimeException(
                'Le montant doit être supérieur à zéro.'
            );
        }

        if (!in_array(
            $donnees['type'],
            ['entree', 'sortie'],
            true
        )) {
            throw new RuntimeException(
                'Le type de mouvement est invalide.'
            );
        }

        return $this->mouvementRepository->creer($donnees);
    }
}