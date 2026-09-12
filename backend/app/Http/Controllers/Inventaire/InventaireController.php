<?php

namespace App\Http\Controllers\Inventaire;

use App\Application\Inventaire\AjouterLigneInventaireUseCase;
use App\Application\Inventaire\CreerInventaireUseCase;
use App\Application\Inventaire\ListerInventairesUseCase;
use App\Application\Inventaire\TrouverInventaireUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InventaireController extends Controller
{
    public function __construct(
        private ListerInventairesUseCase $listerInventairesUseCase,
        private TrouverInventaireUseCase $trouverInventaireUseCase,
        private CreerInventaireUseCase $creerInventaireUseCase,
        private AjouterLigneInventaireUseCase $ajouterLigneInventaireUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        $inventaires = $this->listerInventairesUseCase->executer();

        return response()->json($inventaires);
    }

    public function show(int $id): JsonResponse
    {
        $inventaire = $this->trouverInventaireUseCase->executer($id);

        if (!$inventaire) {
            return response()->json([
                'message' => 'Inventaire introuvable.'
            ], 404);
        }

        return response()->json($inventaire);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'date_inventaire' => ['required', 'date'],
            'motif' => ['nullable', 'string'],
        ]);

        $inventaire = $this->creerInventaireUseCase->executer($donnees);

        return response()->json($inventaire, 201);
    }

    public function ajouterLigne(
        Request $request,
        int $inventaireId
        ): JsonResponse {
            $donnees = $request->validate([
                'lot_id' => [
                    'required',
                    'integer',
                    'exists:lots,id',
                    Rule::unique('inventaires_lignes', 'lot_id')
                        ->where(function ($query) use ($inventaireId) {
                            return $query->where('inventaire_id', $inventaireId);
                        }),
                ],
                'quantite_reelle' => ['required', 'integer', 'min:0'],
            ]);

        try {
            $inventaire = $this->ajouterLigneInventaireUseCase->executer(
                $inventaireId,
                $donnees
            );

            return response()->json($inventaire, 201);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 404);
        }
    }
}