<?php

namespace App\Application\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;

class ListerInventairesUseCase
{
    public function __construct(
        private InventaireRepositoryInterface $inventaireRepository
    ) {
    }

    public function executer(): array
    {
        return $this->inventaireRepository->lister();
    }
}