<?php

namespace App\Application\Personnel\Ports;

use App\Models\User;

interface UserPermissionRepositoryInterface
{
    public function listerParUtilisateur(int $userId): array;

    public function definir(
        int $userId,
        int $permissionId,
        bool $autorise
    ): void;

    public function supprimer(
        int $userId,
        int $permissionId
    ): bool;
}