<?php

namespace App\Application\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;
use App\Models\Inventaire;

class CreerInventaireUseCase
{
    public function __construct(
        private InventaireRepositoryInterface $inventaireRepository
    ) {
    }

    public function executer(array $donnees): Inventaire
    {
        return $this->inventaireRepository->creer($donnees);
    }
}