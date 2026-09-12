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
}