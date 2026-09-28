<?php

namespace App\Application\Personnel\Ports;

use App\Models\Permission;

interface PermissionRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Permission;

    public function creer(array $donnees): Permission;

    public function modifier(
        Permission $permission,
        array $donnees
    ): Permission;

    public function supprimer(Permission $permission): bool;
}