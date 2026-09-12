<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;
use App\Models\User;
use RuntimeException;

class SupprimerUtilisateurUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function executer(User $user): bool
    {
        if ($user->id === auth()->id()) {
            throw new RuntimeException(
                'Vous ne pouvez pas supprimer votre propre compte.'
            );
        }

        return $this->userRepository->supprimer($user);
    }
}