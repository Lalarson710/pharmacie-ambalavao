<?php

namespace App\Application\Sauvegarde\Ports;

interface SauvegardeRepositoryInterface
{
    public function creer(): array;

    public function lister(): array;

    public function restaurer(string $nomFichier): bool;
}