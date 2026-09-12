<?php

namespace App\Infrastructure\Personnel;

use App\Application\Personnel\Ports\RolePermissionRepositoryInterface;
use App\Models\Role;

class RolePermissionRepository implements RolePermissionRepositoryInterface
{
    public function definir(
        int $roleId,
        int $permissionId
    ): void {
        $role = Role::findOrFail($roleId);

        $role->permissions()->syncWithoutDetaching([
            $permissionId,
        ]);
    }

    public function supprimer(
        int $roleId,
        int $permissionId
    ): bool {
        $role = Role::findOrFail($roleId);

        return $role->permissions()
            ->detach($permissionId) > 0;
    }
}