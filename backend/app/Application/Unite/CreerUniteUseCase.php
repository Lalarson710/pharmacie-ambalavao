<?php

namespace App\Application\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;
use App\Models\Unite;

class CreerUniteUseCase
{
    public function __construct(
        private UniteRepositoryInterface $uniteRepository
    ) {
    }

    public function executer(array $donnes): Unite
    {
        return $this->uniteRepository->creer($donnes);
    }
}
