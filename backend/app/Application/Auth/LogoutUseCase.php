<?php

namespace App\Application\Auth;

use App\Application\Auth\Ports\LogoutServiceInterface;

class LogoutUseCase
{
    public function __construct(
        private LogoutServiceInterface $logoutService
    ) {
    }

    public function executer(): void
    {
        $this->logoutService->supprimerTokenActuel();
    }
}