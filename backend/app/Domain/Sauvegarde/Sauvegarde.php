<?php

namespace App\Domain\Sauvegarde;

class Sauvegarde
{
    public function __construct(
        public readonly string $nomFichier,
        public readonly string $chemin,
        public readonly int $taille,
        public readonly string $dateCreation,
    ) {}
}