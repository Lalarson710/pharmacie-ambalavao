<?php

namespace App\Infrastructure\Reglement;

use App\Application\Reglement\Ports\ReglementRepositoryInterface;
use App\Models\Reglement;

class ReglementRepository implements ReglementRepositoryInterface
{
    public function lister(): array
    {
        return Reglement::with('facture.vente.client')
            ->orderByDesc('date_reglement')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Reglement
    {
        return Reglement::with('facture.vente.client')
            ->find($id);
    }

    public function listerParFacture(int $factureId): array
    {
        return Reglement::where('facture_id', $factureId)
            ->orderByDesc('date_reglement')
            ->get()
            ->all();
    }

    public function creer(array $donnees): Reglement
    {
        $reglement = Reglement::create($donnees);

        return $reglement->fresh([
            'facture.vente.client'
        ]);
    }
}