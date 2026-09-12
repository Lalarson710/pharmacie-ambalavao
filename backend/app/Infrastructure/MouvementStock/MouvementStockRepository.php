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

}