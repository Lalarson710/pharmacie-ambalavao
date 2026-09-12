<?php

namespace App\Application\Produit\Ports;

use App\Models\Produit;

interface ProduitRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Produit;

    public function creer(array $donnees): Produit;

    public function modifier(Produit $produit, array $donnees): Produit;

    public function supprimer(Produit $produit): bool;
}