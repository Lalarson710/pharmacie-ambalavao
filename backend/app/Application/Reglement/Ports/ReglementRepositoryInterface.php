<?php

namespace App\Application\Reglement\Ports;

use App\Models\Reglement;

interface ReglementRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Reglement;

    public function listerParFacture(int $factureId): array;

    public function creer(array $donnees): Reglement;
}