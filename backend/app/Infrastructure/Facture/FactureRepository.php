<?php

namespace App\Infrastructure\Facture;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Models\Facture;

class FactureRepository implements FactureRepositoryInterface
{
    public function lister(): array
    {
        return Facture::with('vente.client')
            ->orderByDesc('date_facture')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Facture
    {
        return Facture::with('vente.client')
            ->find($id);
    }

    public function trouverParVenteId(int $venteId): ?Facture
    {
        return Facture::with('vente.client')
            ->where('vente_id', $venteId)
            ->first();
    }

    public function creer(array $donnees): Facture
    {
        return Facture::create($donnees)
            ->load('vente.client');
    }

    public function modifier(
        Facture $facture,
        array $donnees
    ): Facture {
        $facture->update($donnees);

        return $facture->fresh('vente.client');
    }
}