<?php

namespace App\Application\Auth;

use App\Application\Auth\Ports\TokenServiceInterface;
use App\Application\Auth\Ports\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

class LoginUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private TokenServiceInterface $tokenService
    ) {
    }

    public function executer(string $email, string $password)
    {
        $user = $this->userRepository->trouverParEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        $token = $this->tokenService->creer($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}