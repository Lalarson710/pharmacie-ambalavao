<?php

namespace App\Application\Personnel\Ports;

interface RolePermissionRepositoryInterface
{
    public function definir(
        int $roleId,
        int $permissionId
    ): void;

    public function supprimer(
        int $roleId,
        int $permissionId
    ): bool;
}