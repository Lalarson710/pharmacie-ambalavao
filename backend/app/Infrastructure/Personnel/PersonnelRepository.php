<?php

namespace App\Infrastructure\Personnel;

use App\Application\Personnel\Ports\PersonnelRepositoryInterface;
use App\Models\Personnel;

class PersonnelRepository implements PersonnelRepositoryInterface
{
    public function lister(): array
    {
        return Personnel::with('user')
            ->orderBy('nom')
            ->orderBy('prenom')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Personnel
    {
        return Personnel::with('user')->find($id);
    }

    public function creer(array $donnees): Personnel
    {
        return Personnel::create($donnees);
    }

    public function modifier(
        Personnel $personnel,
        array $donnees
    ): Personnel {
        $personnel->update($donnees);

        return $personnel->fresh();
    }

    public function supprimer(Personnel $personnel): bool
    {
        return (bool) $personnel->delete();
    }
}