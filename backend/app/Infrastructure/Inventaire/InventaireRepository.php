<?php

namespace App\Infrastructure\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;
use App\Models\Inventaire;

class InventaireRepository implements InventaireRepositoryInterface
{
    public function lister(): array
    {
        return Inventaire::with('lignes.lot.produit')
            ->orderByDesc('date_inventaire')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Inventaire
    {
        return Inventaire::with('lignes.lot.produit')
            ->find($id);
    }

    public function creer(array $donnees): Inventaire
    {
        return Inventaire::create($donnees);
    }

    public function ajouterLigne(int $inventaireId, array $donnees): Inventaire
    {
        $inventaire = Inventaire::findOrFail($inventaireId);

        $inventaire->lignes()->create($donnees);

        return $inventaire->load('lignes.lot.produit');
    }
}