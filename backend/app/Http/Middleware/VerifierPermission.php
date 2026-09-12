<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifierPermission
{
    public function handle(
        Request $request,
        Closure $next,
        string $permission
    ): Response {
        $user = $request->user();

        if (!$user || !$user->aLaPermission($permission)) {
            return response()->json([
                'message' => 'Accès interdit.'
            ], 403);
        }

        return $next($request);
    }
}