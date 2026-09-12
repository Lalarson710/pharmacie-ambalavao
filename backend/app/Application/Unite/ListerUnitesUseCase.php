<?php

namespace App\Application\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;

class ListerUnitesUseCase
{
    public function __construct(
        private UniteRepositoryInterface $uniteRepository
    ) {
    }

    public function executer(): array
    {
        return $this->uniteRepository->lister();
    }
}