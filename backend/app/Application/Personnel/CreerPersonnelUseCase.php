<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PersonnelRepositoryInterface;
use App\Models\Personnel;

class CreerPersonnelUseCase
{
    public function __construct(
        private PersonnelRepositoryInterface $personnelRepository
    ) {
    }

    public function executer(array $donnees): Personnel
    {
        return $this->personnelRepository->creer($donnees);
    }
}