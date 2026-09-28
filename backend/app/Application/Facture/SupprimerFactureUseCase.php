<?php

namespace App\Application\Facture;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Models\Facture;
use RuntimeException;

class SupprimerFactureUseCase
{
    public function __construct(
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(Facture $facture): void
    {
        $this->factureRepository->supprimer($facture);
    }
}