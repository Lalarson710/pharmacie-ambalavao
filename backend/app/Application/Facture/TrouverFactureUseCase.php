<?php

namespace App\Application\Facture;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Models\Facture;

class TrouverFactureUseCase
{
    public function __construct(
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(int $id): ?Facture
    {
        return $this->factureRepository->trouverParId($id);
    }
}