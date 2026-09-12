<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;
use App\Models\User;

class TrouverUtilisateurUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function executer(int $id): ?User
    {
        return $this->userRepository->trouverParId($id);
    }
}