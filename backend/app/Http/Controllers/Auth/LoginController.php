<?php

namespace App\Http\Controllers\Auth;

use App\Application\Auth\LoginUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function __construct(
        private LoginUseCase $loginUseCase
    ) {
    }

    public function login(Request $request)
    {
        $resultat = $this->loginUseCase->executer(
            $request->email,
            $request->password
        );

        if (!$resultat) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $resultat['user'],
            'token' => $resultat['token'],
        ]);
    }
}         