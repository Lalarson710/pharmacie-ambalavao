<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;
use App\Models\User;
use RuntimeException;

class ModifierUtilisateurUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function executer(
        User $user,
        array $donnees
    ): User {
        if (
            isset($donnees['email'])
            && $donnees['email'] !== $user->email
        ) {
            $utilisateurExistant = $this->userRepository
                ->trouverParEmail($donnees['email']);

            if (
                $utilisateurExistant
                && $utilisateurExistant->id !== $user->id
            ) {
                throw new RuntimeException(
                    'Un utilisateur avec cet email existe déjà.'
                );
            }
        }

        return $this->userRepository->modifier(
            $user,
            $donnees
        );
    }
}