<?php

namespace App\Application\Auth\Ports;

use App\Models\User;

interface UserRepositoryInterface
{
    public function trouverParEmail(string $email): ?User;
}