<?php

namespace App\Application\Categorie\Ports;

use App\Models\Categorie;

interface CategorieRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Categorie;

    public function creer(array $donnees): Categorie;

    public function modifier(Categorie $categorie, array $donnees): Categorie;

    public function supprimer(Categorie $categorie): bool;
}