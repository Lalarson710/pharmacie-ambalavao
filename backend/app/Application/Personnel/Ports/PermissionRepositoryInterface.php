<?php

namespace App\Application\Personnel\Ports;

use App\Models\Permission;

interface PermissionRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Permission;
}