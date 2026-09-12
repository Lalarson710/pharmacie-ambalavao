<?php

namespace App\Infrastructure\Achat;

use App\Application\Achat\Ports\FournisseurRepositoryInterface;
use App\Models\Fournisseur;

class FournisseurRepository implements FournisseurRepositoryInterface
{
    public function lister(): array
    {
        return Fournisseur::orderBy('nom')->get()->all();
    }

    public function trouverParId(int $id): ?Fournisseur
    {
        return Fournisseur::find($id);
    }

    public function creer(array $donnees): Fournisseur
    {
        return Fournisseur::create($donnees);
    }

    public function modifier(
        Fournisseur $fournisseur,
        array $donnees
    ): Fournisseur {
        $fournisseur->update($donnees);

        return $fournisseur->fresh();
    }

    public function supprimer(Fournisseur $fournisseur): bool
    {
        return $fournisseur->delete();
    }
}