<?php

namespace App\Application\MouvementStock\Ports;

use App\Models\MouvementStock;

interface MouvementStockRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?MouvementStock;

    public function creer(array $donnees): MouvementStock;

    public function modifier(
        MouvementStock $mouvementStock,
        array $donnees
    ): MouvementStock;

    public function supprimer(MouvementStock $mouvementStock): bool;
}