<?php

namespace App\Application\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;

class ListerLotsUseCase
{
    public function __construct(
        private LotRepositoryInterface $lotRepository
    ) {
    }

    public function executer(): array
    {
        return $this->lotRepository->lister();
    }
}