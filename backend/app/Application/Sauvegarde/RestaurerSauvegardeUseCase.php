<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;

class RestaurerSauvegardeUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $repository
    ) {
    }

    public function executer(string $nomFichier): bool
    {
        return $this->repository->restaurer($nomFichier);
    }
}