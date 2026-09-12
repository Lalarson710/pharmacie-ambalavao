<?php

namespace App\Adapters\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;

class SauvegardeAdapter
{
    public function __construct(
        private SauvegardeRepositoryInterface $repository
    ) {}

    public function creer(): array
    {
        return $this->repository->creer();
    }

    public function lister(): array
    {
        return $this->repository->lister();
    }

    public function restaurer(string $nomFichier): bool
    {
        return $this->repository->restaurer($nomFichier);
    }
}