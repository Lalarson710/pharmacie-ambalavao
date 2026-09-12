<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;

class ListerSauvegardesUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $repository
    ) {
    }

    public function executer(): array
    {
        return $this->repository->lister();
    }
}