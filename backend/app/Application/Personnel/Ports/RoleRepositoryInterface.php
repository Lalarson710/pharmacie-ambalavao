<?php

namespace App\Application\Personnel\Ports;

use App\Models\Role;

interface RoleRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Role;

    public function creer(array $donnees): Role;

    public function modifier(
        Role $role,
        array $donnees
    ): Role;

    public function supprimer(Role $role): bool;
}