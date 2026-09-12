<?php

namespace App\Infrastructure\Categorie;

use App\Application\Categorie\Ports\CategorieRepositoryInterface;
use App\Models\Categorie;

class CategorieRepository implements CategorieRepositoryInterface
{
    public function lister(): array
    {
        return Categorie::all()->all();
    }

    public function trouverParId(int $id): ?Categorie
    {
        return Categorie::find($id);
    }

    public function creer(array $donnees): Categorie
    {
        return Categorie::create($donnees);
    }

    public function modifier(Categorie $categorie, array $donnees): Categorie
    {
        $categorie->update($donnees);

        return $categorie->fresh();
    }

    public function supprimer(Categorie $categorie): bool
    {
        return (bool) $categorie->delete();
    }
}