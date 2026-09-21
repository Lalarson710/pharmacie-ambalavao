<?php

namespace App\Application\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;
use App\Models\Unite;

class TrouverUniteUseCase
{
    public function __construct(
        private UniteRepositoryInterface $uniteRepository
    ) {
    }

    public function executer(int $id): ?Unite
    {
        return $this->uniteRepository->trouverParId($id);
    }
}
