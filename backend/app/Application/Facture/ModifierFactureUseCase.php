<?php

namespace App\Application\Facture;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Models\Facture;

class ModifierFactureUseCase
{
    public function __construct(
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(
        Facture $facture,
        array $donnees
    ): Facture {
        return $this->factureRepository->modifier(
            $facture,
            $donnees
        );
    }
}