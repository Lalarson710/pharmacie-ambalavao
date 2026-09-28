<?php

namespace App\Infrastructure\MouvementStock;

use App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface;
use App\Models\MouvementStock;

class MouvementStockRepository implements MouvementStockRepositoryInterface
{
    public function lister(): array
    {
        return MouvementStock::with('lot.produit')->get()->all();
    }

    public function trouverParId(int $id): ?MouvementStock
    {
        return MouvementStock::with('lot.produit')->find($id);
    }

    public function creer(array $donnees): MouvementStock
    {
        $mouvementStock = MouvementStock::create($donnees);

        return $mouvementStock->load('lot.produit');
    }

    public function modifier(
        MouvementStock $mouvementStock,
        array $donnees
    ): MouvementStock {
        $mouvementStock->update($donnees);

        return $mouvementStock->fresh('lot.produit');
    }

    public function supprimer(MouvementStock $mouvementStock): bool
    {
        return $mouvementStock->delete();
    }
}