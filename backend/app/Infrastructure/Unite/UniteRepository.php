<?php

namespace App\Infrastructure\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;
use App\Models\Unite;

class UniteRepository implements UniteRepositoryInterface
{
    public function lister(): array
    {
        return Unite::all()->all();
    }

    public function trouverParId(int $id): ?Unite
    {
        return Unite::find($id);
    }

    public function creer(array $donnes): Unite
    {
        return Unite::create($donnes);
    }

    public function modifier(Unite $unite, array $donnes): Unite
    {
        $unite->update($donnes);

        return $unite;
    }

    public function supprimer(Unite $unite): bool
    {
        return (bool) $unite->delete();
    }
}
