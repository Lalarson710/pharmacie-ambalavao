<?php

namespace App\Application\Caisse\Ports;

use App\Models\MouvementCaisse;

interface MouvementCaisseRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?MouvementCaisse;

    public function listerParCaisse(int $caisseId): array;

    public function creer(array $donnees): MouvementCaisse;
}