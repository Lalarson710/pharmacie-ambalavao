<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;

class ListerUtilisateursUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function executer(): array
    {
        return $this->userRepository->lister();
    }
}