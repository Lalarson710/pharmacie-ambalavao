<?php

namespace App\Domain\Statistiques;

class Statistiques
{
    public function __construct(
        public readonly string $dateDebut,
        public readonly string $dateFin,
        public readonly int $nombreVentes,
        public readonly float $chiffreAffaires,
        public readonly array $produitsPlusVendus = [],
    ) {}
}