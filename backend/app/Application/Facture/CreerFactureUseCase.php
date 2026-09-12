<?php

namespace App\Application\Facture;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Models\Facture;

class CreerFactureUseCase
{
    public function __construct(
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(array $donnees): Facture
    {
        return $this->factureRepository->creer($donnees);
    }
}