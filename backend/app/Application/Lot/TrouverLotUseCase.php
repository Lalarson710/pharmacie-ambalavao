<?php

namespace App\Application\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Models\Lot;

class TrouverLotUseCase
{
    public function __construct(
        private LotRepositoryInterface $lotRepository
    ) {
    }

    public function executer(int $id): ?Lot
    {
        return $this->lotRepository->trouverParId($id);
    }
}