<?php

namespace App\Application\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;
use App\Models\Inventaire;

class ModifierInventaireUseCase
{
    public function __construct(
        private InventaireRepositoryInterface $inventaireRepository
    ) {
    }

    public function executer(
        Inventaire $inventaire,
        array $donnees
    ): Inventaire {
        return $this->inventaireRepository->modifier(
            $inventaire,
            $donnees
        );
    }
}