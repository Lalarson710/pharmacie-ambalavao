<?php

namespace App\Infrastructure\Auth;

use App\Application\Auth\Ports\TokenServiceInterface;
use App\Models\User;

class SanctumTokenService implements TokenServiceInterface
{
    public function creer(User $user): string
    {
        return $user->createToken('auth-token')->plainTextToken;
    }
}