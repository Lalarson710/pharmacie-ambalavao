<?php

namespace App\Application\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;
use App\Models\Inventaire;

class TrouverInventaireUseCase
{
    public function __construct(
        private InventaireRepositoryInterface $inventaireRepository
    ) {
    }

    public function executer(int $id): ?Inventaire
    {
        return $this->inventaireRepository->trouverParId($id);
    }
}