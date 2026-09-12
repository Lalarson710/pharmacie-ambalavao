<?php

namespace App\Http\Controllers\Statistiques;

use App\Application\Statistiques\ObtenirChiffreAffairesUseCase;
use App\Application\Statistiques\ObtenirProduitsPlusVendusUseCase;
use App\Application\Statistiques\ObtenirStatistiquesVentesUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StatistiquesController extends Controller
{
    public function ventes(
        Request $request,
        ObtenirStatistiquesVentesUseCase $useCase
    ) {
        $dateDebut = $request->query(
            'date_debut',
            now()->startOfMonth()->toDateString()
        );

        $dateFin = $request->query(
            'date_fin',
            now()->toDateString()
        );

        return response()->json([
            'data' => $useCase->executer(
                $dateDebut,
                $dateFin
            ),
        ]);
    }

    public function produitsPlusVendus(
        Request $request,
        ObtenirProduitsPlusVendusUseCase $useCase
    ) {
        $dateDebut = $request->query(
            'date_debut',
            now()->startOfMonth()->toDateString()
        );

        $dateFin = $request->query(
            'date_fin',
            now()->toDateString()
        );

        return response()->json([
            'data' => $useCase->executer(
                $dateDebut,
                $dateFin
            ),
        ]);
    }

    public function chiffreAffaires(
        Request $request,
        ObtenirChiffreAffairesUseCase $useCase
    ) {
        $dateDebut = $request->query(
            'date_debut',
            now()->startOfMonth()->toDateString()
        );

        $dateFin = $request->query(
            'date_fin',
            now()->toDateString()
        );

        return response()->json([
            'data' => $useCase->executer(
                $dateDebut,
                $dateFin
            ),
        ]);
    }
}