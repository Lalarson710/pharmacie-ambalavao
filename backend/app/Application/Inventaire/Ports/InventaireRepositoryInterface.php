<?php

namespace App\Application\Inventaire\Ports;

use App\Models\Inventaire;

interface InventaireRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Inventaire;

    public function creer(array $donnees): Inventaire;

    public function ajouterLigne(int $inventaireId, array $donnees): Inventaire;
}