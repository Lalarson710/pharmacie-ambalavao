<?php

namespace App\Infrastructure\Caisse;

use App\Application\Caisse\Ports\CaisseRepositoryInterface;
use App\Models\Caisse;
use App\Models\MouvementCaisse;

class CaisseRepository implements CaisseRepositoryInterface
{
    public function lister(): array
    {
        return Caisse::with('utilisateur')
            ->orderByDesc('date_ouverture')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Caisse
    {
        return Caisse::with('utilisateur')
            ->find($id);
    }

    public function trouverCaisseOuverteParUtilisateur(
        int $userId
    ): ?Caisse {
        return Caisse::where('user_id', $userId)
            ->where('statut', 'ouverte')
            ->first();
    }

    public function creer(array $donnees): Caisse
    {
        return Caisse::create($donnees)
            ->load('utilisateur');
    }

    public function modifier(
        Caisse $caisse,
        array $donnees
    ): Caisse {
        $caisse->update($donnees);

        return $caisse->fresh('utilisateur');
    }

    public function calculerSoldeTheorique(int $caisseId): float
    {
        $caisse = Caisse::findOrFail($caisseId);

        $entrees = MouvementCaisse::where('caisse_id', $caisseId)
            ->where('type', 'entree')
            ->sum('montant');

        $sorties = MouvementCaisse::where('caisse_id', $caisseId)
            ->where('type', 'sortie')
            ->sum('montant');

        return (float) $caisse->montant_initial
            + (float) $entrees
            - (float) $sorties;
    }
}