<?php

namespace App\Infrastructure\Rapport;

use App\Application\Rapport\Ports\RapportRepositoryInterface;
use App\Models\Rapport;

class RapportRepository implements RapportRepositoryInterface
{
    public function lister(): array
    {
        return Rapport::orderByDesc('date_debut')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Rapport
    {
        return Rapport::find($id);
    }

    public function creer(array $donnees): Rapport
    {
        return Rapport::create($donnees);
    }

    public function modifier(
        Rapport $rapport,
        array $donnees
    ): Rapport {
        $rapport->update($donnees);

        return $rapport->fresh();
    }

    public function supprimer(Rapport $rapport): bool
    {
        return $rapport->delete();
    }
}