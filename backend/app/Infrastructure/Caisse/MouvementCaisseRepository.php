<?php

namespace App\Infrastructure\Caisse;

use App\Application\Caisse\Ports\MouvementCaisseRepositoryInterface;
use App\Models\MouvementCaisse;

class MouvementCaisseRepository implements MouvementCaisseRepositoryInterface
{
    public function lister(): array
    {
        return MouvementCaisse::with('caisse.utilisateur', 'reglement')
            ->orderByDesc('created_at')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?MouvementCaisse
    {
        return MouvementCaisse::with('caisse.utilisateur', 'reglement')
            ->find($id);
    }

    public function listerParCaisse(int $caisseId): array
    {
        return MouvementCaisse::where('caisse_id', $caisseId)
            ->orderByDesc('created_at')
            ->get()
            ->all();
    }

    public function creer(array $donnees): MouvementCaisse
    {
        return MouvementCaisse::create($donnees)
            ->load('caisse.utilisateur', 'reglement');
    }
}