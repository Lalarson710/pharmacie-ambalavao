<?php

namespace App\Application\Produit\Ports;

use App\Models\ProduitConditionnement;

interface ProduitConditionnementRepositoryInterface
{
    public function lister(): array;

    public function listerParProduit(int $produitId): array;

    public function trouverParId(int $id): ?ProduitConditionnement;

    public function trouverParProduitEtUnite(int $produitId, int $uniteId): ?ProduitConditionnement;

    public function creer(array $donnees): ProduitConditionnement;

    public function modifier(ProduitConditionnement $conditionnement, array $donnees): ProduitConditionnement;

    public function supprimer(ProduitConditionnement $conditionnement): bool;

    public function getUniteBase(int $produitId): ?ProduitConditionnement;
}