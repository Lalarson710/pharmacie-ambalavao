<?php

namespace App\Infrastructure\Vente;

use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;

class VenteRepository implements VenteRepositoryInterface
{
    public function lister(): array
    {
        return Vente::with('client', 'lignes.produit', 'lignes.lot')
            ->orderByDesc('date_vente')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Vente
    {
        return Vente::with('client', 'lignes.produit', 'lignes.lot')
            ->find($id);
    }

    public function creer(array $donnees): Vente
    {
        return Vente::create($donnees);
    }

    public function modifier(Vente $vente, array $donnees): Vente
    {
        $vente->update($donnees);

        return $vente->fresh(
            ['client', 'lignes.produit', 'lignes.lot']
        );
    }

    public function supprimer(Vente $vente): bool
    {
        return $vente->delete();
    }
}