<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\PersonnelRepositoryInterface;
use App\Models\Personnel;

class TrouverPersonnelUseCase
{
    public function __construct(
        private PersonnelRepositoryInterface $personnelRepository
    ) {
    }

    public function executer(int $id): ?Personnel
    {
        return $this->personnelRepository->trouverParId($id);
    }
}