<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;

class ListerAchatsUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository
    ) {
    }

    public function executer(): array
    {
        return $this->achatRepository->lister();
    }
}