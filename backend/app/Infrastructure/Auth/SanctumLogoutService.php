<?php

namespace App\Infrastructure\Auth;

use App\Application\Auth\Ports\LogoutServiceInterface;
use Illuminate\Support\Facades\Auth;

class SanctumLogoutService implements LogoutServiceInterface
{
    public function supprimerTokenActuel(): void
    {
        Auth::user()->currentAccessToken()->delete();
    }
}