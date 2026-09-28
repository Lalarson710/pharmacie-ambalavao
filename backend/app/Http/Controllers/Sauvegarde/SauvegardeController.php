<?php

namespace App\Http\Controllers\Sauvegarde;

use App\Application\Sauvegarde\CreerSauvegardeUseCase;
use App\Application\Sauvegarde\ListerSauvegardesUseCase;
use App\Application\Sauvegarde\ModifierSauvegardeUseCase;
use App\Application\Sauvegarde\RestaurerSauvegardeUseCase;
use App\Application\Sauvegarde\SupprimerSauvegardeUseCase;
use App\Application\Sauvegarde\TrouverSauvegardeUseCase;
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

    public function show(int $id, TrouverSauvegardeUseCase $useCase)
    {
        $sauvegarde = $useCase->executer($id);

        if (!$sauvegarde) {
            return response()->json([
                'message' => 'Sauvegarde introuvable.'
            ], 404);
        }

        return response()->json($sauvegarde);
    }

    public function update(Request $request, int $id, ModifierSauvegardeUseCase $useCase)
    {
        $sauvegarde = $useCase->executer($id);

        if (!$sauvegarde) {
            return response()->json([
                'message' => 'Sauvegarde introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $sauvegarde = $useCase->executer($sauvegarde, $donnees);

        return response()->json($sauvegarde);
    }

    public function destroy(int $id, SupprimerSauvegardeUseCase $useCase)
    {
        $sauvegarde = $useCase->executer($id);

        if (!$sauvegarde) {
            return response()->json([
                'message' => 'Sauvegarde introuvable.'
            ], 404);
        }

        $useCase->executer($sauvegarde);

        return response()->json([
            'message' => 'Sauvegarde supprimée avec succès.'
        ]);
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

    public function importer(Request $request): JsonResponse
    {
        $request->validate([
            'fichier' => 'required|file|mimes:sql,gz,zip',
        ]);

        // L'import sera géré par le use case approprié
        return response()->json([
            'message' => 'Fichier de sauvegarde reçu pour import.',
        ]);
    }
}