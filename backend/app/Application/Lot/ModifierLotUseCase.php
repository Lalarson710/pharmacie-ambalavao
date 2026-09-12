<?php

namespace App\Application\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Models\Lot;

class ModifierLotUseCase
{
    public function __construct(
        private LotRepositoryInterface $lotRepository
    ) {
    }

    public function executer(int $id, array $donnees): ?Lot
    {
        $lot = $this->lotRepository->trouverParId($id);

        if (!$lot) {
            return null;
        }

        return $this->lotRepository->modifier(
            $lot,
            $donnees
        );
    }
}