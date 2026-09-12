<?php

namespace App\Infrastructure\Vente;

use App\Application\Vente\Ports\VenteLigneRepositoryInterface;
use App\Models\VenteLigne;

class VenteLigneRepository implements VenteLigneRepositoryInterface
{
    public function listerParVente(int $venteId): array
    {
        return VenteLigne::with('produit', 'lot')
            ->where('vente_id', $venteId)
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?VenteLigne
    {
        return VenteLigne::with('produit', 'lot')
            ->find($id);
    }

    public function creer(array $donnees): VenteLigne
    {
        return VenteLigne::create($donnees)
            ->load('produit', 'lot');
    }

    public function supprimer(VenteLigne $ligne): bool
    {
        return $ligne->delete();
    }
}