<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PersonnelRepositoryInterface;
use App\Models\Personnel;

class ModifierPersonnelUseCase
{
    public function __construct(
        private PersonnelRepositoryInterface $personnelRepository
    ) {
    }

    public function executer(
        Personnel $personnel,
        array $donnees
    ): Personnel {
        return $this->personnelRepository->modifier(
            $personnel,
            $donnees
        );
    }
}