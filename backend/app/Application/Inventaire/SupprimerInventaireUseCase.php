<?php

namespace App\Application\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;
use App\Models\Inventaire;
use RuntimeException;

class SupprimerInventaireUseCase
{
    public function __construct(
        private InventaireRepositoryInterface $inventaireRepository
    ) {
    }

    public function executer(Inventaire $inventaire): void
    {
        $this->inventaireRepository->supprimer($inventaire);
    }
}