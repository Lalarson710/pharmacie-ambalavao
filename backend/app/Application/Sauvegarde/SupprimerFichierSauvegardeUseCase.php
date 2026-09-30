<?php

namespace App\Application\Sauvegarde;

use App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface;

class SupprimerFichierSauvegardeUseCase
{
    public function __construct(
        private SauvegardeRepositoryInterface $repository
    ) {
    }

    /**
     * Les sauvegardes etant des fichiers disque, la suppression
     * s'identifie par le nom du fichier.
     */
    public function executer(string $nomFichier): bool
    {
        return $this->repository->supprimer($nomFichier);
    }
}
