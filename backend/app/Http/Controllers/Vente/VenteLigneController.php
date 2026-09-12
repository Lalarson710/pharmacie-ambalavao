<?php

namespace App\Http\Controllers\Vente;

use App\Application\Vente\AjouterLigneVenteUseCase;
use App\Application\Vente\ListerLignesVenteUseCase;
use App\Application\Vente\SupprimerLigneVenteUseCase;
use App\Application\Vente\TrouverLigneVenteUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\VenteLigne;
use RuntimeException;

class VenteLigneController
{
    public function __construct(
        private ListerLignesVenteUseCase $listerLignesVenteUseCase,
        private TrouverLigneVenteUseCase $trouverLigneVenteUseCase,
        private AjouterLigneVenteUseCase $ajouterLigneVenteUseCase,
        private SupprimerLigneVenteUseCase $supprimerLigneVenteUseCase
    ) {
    }

    public function index(int $venteId): JsonResponse
    {
        return response()->json(
            $this->listerLignesVenteUseCase->executer($venteId)
        );
    }

    public function show(int $id): JsonResponse
    {
        $ligne = $this->trouverLigneVenteUseCase->executer($id);

        if (!$ligne) {
            return response()->json([
                'message' => 'Ligne de vente introuvable.'
            ], 404);
        }

        return response()->json($ligne);
    }

    public function store(
        Request $request,
        int $venteId
    ): JsonResponse {
        $donnees = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'lot_id' => 'required|exists:lots,id',
            'quantite' => 'required|integer|min:1',
        ]);

        $donnees['vente_id'] = $venteId;

        try {
            $ligne = $this->ajouterLigneVenteUseCase
                ->executer($donnees);

            return response()->json($ligne, 201);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $ligne = $this->trouverLigneVenteUseCase->executer($id);

        if (!$ligne) {
            return response()->json([
                'message' => 'Ligne de vente introuvable.'
            ], 404);
        }

        try {
            $this->supprimerLigneVenteUseCase
                ->executer($ligne);

            return response()->json([
                'message' => 'Ligne de vente supprimée avec succès.'
            ]);

        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}