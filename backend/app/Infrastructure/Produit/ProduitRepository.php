<?php

namespace App\Infrastructure\Produit;

use App\Application\Produit\Ports\ProduitRepositoryInterface;
use App\Models\Produit;

class ProduitRepository implements ProduitRepositoryInterface
{
    public function lister(): array
    {
        return Produit::with(['categorie', 'unite'])->get()->all();
    }

    public function trouverParId(int $id): ?Produit
    {
        return Produit::with(['categorie', 'unite'])->find($id);
    }

    public function creer(array $donnees): Produit
    {
        $produit = Produit::create($donnees);

        return $produit->load(['categorie', 'unite']);
    }

    public function modifier(Produit $produit, array $donnees): Produit
    {
        $produit->update($donnees);

        return $produit->fresh(['categorie', 'unite']);
    }

    public function supprimer(Produit $produit): bool
    {
        return (bool) $produit->delete();
    }
}