<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;
use App\Models\User;
use RuntimeException;

class CreerUtilisateurUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function executer(array $donnees): User
    {
        $utilisateurExistant = $this->userRepository
            ->trouverParEmail($donnees['email']);

        if ($utilisateurExistant) {
            throw new RuntimeException(
                'Un utilisateur avec cet email existe déjà.'
            );
        }

        return $this->userRepository->creer($donnees);
    }
}