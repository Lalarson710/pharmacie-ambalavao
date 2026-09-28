<?php

namespace App\Infrastructure\Personnel;

use App\Application\Personnel\Ports\PermissionRepositoryInterface;
use App\Models\Permission;

class PermissionRepository implements PermissionRepositoryInterface
{
    public function lister(): array
    {
        return Permission::orderBy('code')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?Permission
    {
        return Permission::find($id);
    }

    public function creer(array $donnees): Permission
    {
        return Permission::create($donnees);
    }

    public function modifier(Permission $permission, array $donnees): Permission
    {
        $permission->update($donnees);
        return $permission->fresh();
    }

    public function supprimer(Permission $permission): bool
    {
        return $permission->delete();
    }
}