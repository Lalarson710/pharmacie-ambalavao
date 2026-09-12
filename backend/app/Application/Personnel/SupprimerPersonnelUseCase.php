<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PersonnelRepositoryInterface;
use App\Models\Personnel;

class SupprimerPersonnelUseCase
{
    public function __construct(
        private PersonnelRepositoryInterface $personnelRepository
    ) {
    }

    public function executer(Personnel $personnel): bool
    {
        return $this->personnelRepository->supprimer($personnel);
    }
}