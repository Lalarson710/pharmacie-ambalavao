<?php

namespace App\Infrastructure\Personnel;

use App\Application\Personnel\Ports\UserPermissionRepositoryInterface;
use App\Models\Permission;
use App\Models\User;

class UserPermissionRepository implements UserPermissionRepositoryInterface
{
    public function listerParUtilisateur(int $userId): array
    {
        $user = User::with('permissions')->findOrFail($userId);

        return $user->permissions->all();
    }

    public function definir(
        int $userId,
        int $permissionId,
        bool $autorise
    ): void {
        $user = User::findOrFail($userId);

        $user->permissions()->syncWithoutDetaching([
            $permissionId => [
                'autorise' => $autorise,
            ],
        ]);
    }

    public function supprimer(
        int $userId,
        int $permissionId
    ): bool {
        $user = User::findOrFail($userId);

        return $user->permissions()
            ->detach($permissionId) > 0;
    }
}