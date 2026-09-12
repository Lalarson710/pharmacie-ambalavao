<?php

namespace App\Http\Controllers\Personnel;

use App\Application\Personnel\ListerPermissionsUseCase;
use Illuminate\Http\JsonResponse;

class PermissionController
{
    public function __construct(
        private ListerPermissionsUseCase $listerPermissionsUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerPermissionsUseCase->executer()
        );
    }
}