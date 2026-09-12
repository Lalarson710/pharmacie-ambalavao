<?php

namespace App\Http\Controllers\Facture;

use App\Application\Facture\GenererImpressionFactureUseCase;
use App\Http\Controllers\Controller;

class ImpressionFactureController extends Controller
{
    public function afficher(
        int $id,
        GenererImpressionFactureUseCase $useCase
    ) {
        $donnees = $useCase->executer($id);

        if (!$donnees) {
            return response()->json([
                'message' => 'Facture introuvable.'
            ], 404);
        }

        return response()->json([
            'data' => $donnees,
        ]);
    }
}