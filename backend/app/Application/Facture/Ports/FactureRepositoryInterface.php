<?php

namespace App\Application\Facture\Ports;

use App\Models\Facture;

interface FactureRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Facture;

    public function trouverParVenteId(int $venteId): ?Facture;

    public function creer(array $donnees): Facture;

    public function modifier(
        Facture $facture,
        array $donnees
    ): Facture;
}