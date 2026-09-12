<?php

namespace App\Http\Controllers\Sauvegarde;

use App\Application\Sauvegarde\CreerSauvegardeUseCase;
use App\Application\Sauvegarde\ListerSauvegardesUseCase;
use App\Application\Sauvegarde\RestaurerSauvegardeUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SauvegardeController extends Controller
{
    public function index(
        ListerSauvegardesUseCase $useCase
    ) {
        return response()->json([
            'data' => $useCase->executer(),
        ]);
    }

    public function store(
        CreerSauvegardeUseCase $useCase
    ) {
        return response()->json([
            'message' => 'Sauvegarde créée avec succès.',
            'data' => $useCase->executer(),
        ], 201);
    }

    public function restaurer(
        Request $request,
        RestaurerSauvegardeUseCase $useCase
    ) {
        $donnees = $request->validate([
            'nom_fichier' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $useCase->executer($donnees['nom_fichier']);

        return response()->json([
            'message' => 'Sauvegarde restaurée avec succès.',
        ]);
    }
}