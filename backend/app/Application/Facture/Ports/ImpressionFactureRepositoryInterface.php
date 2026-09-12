<?php

namespace App\Application\Facture\Ports;

interface ImpressionFactureRepositoryInterface
{
    public function obtenirDonnees(int $factureId): ?array;
}