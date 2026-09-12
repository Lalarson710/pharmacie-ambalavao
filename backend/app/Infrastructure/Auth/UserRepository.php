<?php

namespace App\Infrastructure\Auth;

use App\Application\Auth\Ports\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function trouverParEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}