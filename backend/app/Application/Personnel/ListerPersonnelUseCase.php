<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PersonnelRepositoryInterface;

class ListerPersonnelUseCase
{
    public function __construct(
        private PersonnelRepositoryInterface $personnelRepository
    ) {
    }

    public function executer(): array
    {
        return $this->personnelRepository->lister();
    }
}