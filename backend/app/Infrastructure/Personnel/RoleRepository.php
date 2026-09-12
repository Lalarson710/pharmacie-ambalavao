<?php

namespace App\Infrastructure\Personnel;

use App\Application\Personnel\Ports\RoleRepositoryInterface;
use App\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    public function lister(): array
    {
        return Role::orderBy('nom')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Role
    {
        return Role::find($id);
    }

    public function creer(array $donnees): Role
    {
        return Role::create($donnees);
    }

    public function modifier(
        Role $role,
        array $donnees
    ): Role {
        $role->update($donnees);

        return $role->fresh();
    }

    public function supprimer(Role $role): bool
    {
        return (bool) $role->delete();
    }
}