<?php

namespace App\Application\Vente;

use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;
use RuntimeException;

class SupprimerVenteUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository
    ) {
    }

    public function executer(Vente $vente): void
    {
        if ($vente->statut !== 'brouillon') {
            throw new RuntimeException(
                'Impossible de supprimer une vente qui n’est plus en brouillon.'
            );
        }

        if ($vente->lignes()->exists()) {
            throw new RuntimeException(
                'Impossible de supprimer une vente qui contient des lignes.'
            );
        }

        $this->venteRepository->supprimer($vente);
    }
}