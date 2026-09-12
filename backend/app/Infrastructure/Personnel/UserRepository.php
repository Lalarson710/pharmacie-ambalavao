<?php

namespace App\Infrastructure\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function lister(): array
    {
        return User::with('role')
            ->orderBy('name')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?User
    {
        return User::with([
            'role',
            'personnel',
        ])->find($id);
    }

    public function trouverParEmail(string $email): ?User
    {
        return User::with('role')
            ->where('email', $email)
            ->first();
    }

    public function creer(array $donnees): User
    {
        return User::create($donnees)
            ->load('role');
    }

    public function modifier(
        User $user,
        array $donnees
    ): User {
        $user->update($donnees);

        return $user->fresh('role');
    }

    public function supprimer(User $user): bool
    {
        return (bool) $user->delete();
    }
}