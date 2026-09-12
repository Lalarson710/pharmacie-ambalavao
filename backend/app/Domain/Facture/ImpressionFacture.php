<?php

namespace App\Domain\Facture;

class ImpressionFacture
{
    public function __construct(
        public readonly int $factureId,
        public readonly string $numero,
        public readonly string $date,
        public readonly float $montantTotal,
        public readonly string $statut,
        public readonly ?array $client = null,
        public readonly array $lignes = [],
    ) {}
}