<?php

namespace App\Domain\Alertes;

class Alerte
{
    public function __construct(
        public readonly string $type,
        public readonly string $message,
        public readonly ?int $produitId = null,
        public readonly ?int $lotId = null,
        public readonly ?int $quantite = null,
        public readonly ?string $datePeremption = null,
    ) {}
}