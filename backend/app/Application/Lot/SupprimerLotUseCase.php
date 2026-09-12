<?php

namespace App\Application\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;

class SupprimerLotUseCase
{
    public function __construct(
        private LotRepositoryInterface $lotRepository
    ) {
    }

    public function executer(int $id): bool
    {
        $lot = $this->lotRepository->trouverParId($id);

        if (!$lot) {
            return false;
        }

        return $this->lotRepository->supprimer($lot);
    }
}