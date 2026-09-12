<?php

namespace App\Application\Auth\Ports;

interface LogoutServiceInterface
{
    public function supprimerTokenActuel(): void;
}