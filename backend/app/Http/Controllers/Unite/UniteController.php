<?php

namespace App\Http\Controllers\Unite;

use App\Application\Unite\ListerUnitesUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UniteController extends Controller
{
    public function __construct(
        private ListerUnitesUseCase $listerUnitesUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $unites = $this->listerUnitesUseCase->executer();

        return response()->json($unites);
    }
}