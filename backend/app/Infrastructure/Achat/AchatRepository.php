<?php

namespace App\Infrastructure\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\Achat;

class AchatRepository implements AchatRepositoryInterface
{
    public function lister(): array
    {
        return Achat::with('fournisseur', 'lignes.produit')
            ->orderByDesc('date_achat')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Achat
    {
        return Achat::with('fournisseur', 'lignes.produit')
            ->find($id);
    }

    public function creer(array $donnees): Achat
    {
        return Achat::create($donnees);
    }

    public function modifier(
        Achat $achat,
        array $donnees
    ): Achat {
        $achat->update($donnees);

        return $achat->fresh('fournisseur', 'lignes.produit');
    }

    public function supprimer(Achat $achat): bool
    {
        return $achat->delete();
    }
}