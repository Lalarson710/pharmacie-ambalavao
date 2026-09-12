<?php

namespace App\Application\Personnel\Ports;

use App\Models\User;

interface UserRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?User;

    public function trouverParEmail(string $email): ?User;

    public function creer(array $donnees): User;

    public function modifier(User $user, array $donnees): User;

    public function supprimer(User $user): bool;
}