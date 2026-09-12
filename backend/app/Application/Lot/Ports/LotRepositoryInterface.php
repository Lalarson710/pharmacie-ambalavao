<?php

namespace App\Application\Lot\Ports;

use App\Models\Lot;

interface LotRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Lot;

    public function creer(array $donnees): Lot;

    public function modifier(Lot $lot, array $donnees): Lot;

    public function supprimer(Lot $lot): bool;

    public function modifierQuantite(Lot $lot, int $quantite): Lot;

    public function trouverParProduitEtNumeroLot(
        int $produitId,
        string $numeroLot
    ): ?Lot;
}