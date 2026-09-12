<?php

namespace App\Application\Auth\Ports;

use App\Models\User;

interface TokenServiceInterface
{
    public function creer(User $user): string;
}