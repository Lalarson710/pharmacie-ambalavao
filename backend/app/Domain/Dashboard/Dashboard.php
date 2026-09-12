<?php

namespace App\Domain\Dashboard;

class Dashboard
{
    public function __construct(
        public readonly int $totalProduits,
        public readonly int $ventesJour,
        public readonly float $chiffreAffairesJour,
        public readonly int $stocksFaibles,
        public readonly int $ruptures,
        public readonly int $peremptionsProches,
        public readonly int $facturesImpayees,
    ) {}
}