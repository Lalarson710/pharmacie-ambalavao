<?php

namespace App\Http\Controllers\Auth;

use App\Application\Auth\LogoutUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class LogoutController extends Controller
{
    public function __construct(
        private LogoutUseCase $logoutUseCase
    ) {
    }

    public function logout(): JsonResponse
    {
        $this->logoutUseCase->executer();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ]);
    }
}