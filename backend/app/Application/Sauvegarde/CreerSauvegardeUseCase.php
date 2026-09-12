<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;

class CreerSauvegardeUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $repository
    ) {
    }

    public function executer(): array
    {
        return $this->repository->creer();
    }
}