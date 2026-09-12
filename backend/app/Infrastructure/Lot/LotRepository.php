<?php

namespace App\Infrastructure\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Models\Lot;

class LotRepository implements LotRepositoryInterface
{
    public function lister(): array
    {
        return Lot::with('produit')->get()->all();
    }

    public function trouverParId(int $id): ?Lot
    {
        return Lot::with('produit')->find($id);
    }

    public function creer(array $donnees): Lot
    {
        $lot = Lot::create($donnees);

        return $lot->load('produit');
    }

    public function modifier(Lot $lot, array $donnees): Lot
    {
        $lot->update($donnees);

        return $lot->fresh('produit');
    }

    public function supprimer(Lot $lot): bool
    {
        return (bool) $lot->delete();
    }

    public function modifierQuantite(Lot $lot, int $quantite): Lot
    {
        $lot->update([
            'quantite' => $quantite,
        ]);

        return $lot->fresh('produit');
    }

    public function trouverParProduitEtNumeroLot(
        int $produitId,
        string $numeroLot
    ): ?Lot {
        return Lot::where('produit_id', $produitId)
            ->where('numero_lot', $numeroLot)
            ->first();
    }
}