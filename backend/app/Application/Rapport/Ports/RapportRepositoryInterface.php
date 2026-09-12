<?php

namespace App\Application\Rapport\Ports;

use App\Models\Rapport;

interface RapportRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Rapport;

    public function creer(array $donnees): Rapport;
}