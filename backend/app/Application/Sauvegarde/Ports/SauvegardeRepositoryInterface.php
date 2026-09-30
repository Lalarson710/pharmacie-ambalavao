<?php

namespace App\Application\Sauvegarde\Ports;

interface SauvegardeRepositoryInterface
{
    public function creer(): array;

    public function lister(): array;

    public function restaurer(string $nomFichier): bool;

    /**
     * Supprime physiquement le fichier de sauvegarde.
     * Les sauvegardes sont des fichiers disque : la cle est donc
     * le nom du fichier, et non un identifiant en base.
     */
    public function supprimer(string $nomFichier): bool;
}