<?php

namespace App\Http\Controllers\Achat;

use App\Application\Achat\CreerAchatUseCase;
use App\Application\Achat\ListerAchatsUseCase;
use App\Application\Achat\ModifierAchatUseCase;
use App\Application\Achat\SupprimerAchatUseCase;
use App\Application\Achat\TrouverAchatUseCase;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Application\Achat\ConfirmerAchatUseCase;
use App\Application\Achat\AnnulerAchatUseCase;

class AchatController extends Controller
{
    public function __construct(
        private ListerAchatsUseCase $listerAchatsUseCase,
        private TrouverAchatUseCase $trouverAchatUseCase,
        private CreerAchatUseCase $creerAchatUseCase,
        private ModifierAchatUseCase $modifierAchatUseCase,
        private SupprimerAchatUseCase $supprimerAchatUseCase,
        private ConfirmerAchatUseCase $confirmerAchatUseCase,
        private AnnulerAchatUseCase $annulerAchatUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerAchatsUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        return response()->json($achat);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'fournisseur_id' => [
                'required',
                'integer',
                'exists:fournisseurs,id'
            ],
            'numero' => [
                'required',
                'string',
                'max:50',
                'unique:achats,numero'
            ],
            'date_achat' => ['required', 'date'],
            'montant_total' => ['nullable', 'numeric', 'min:0'],
            'statut' => [
                'nullable',
                'in:brouillon,confirme,annule'
            ],
            'observation' => ['nullable', 'string'],
        ]);

        $achat = $this->creerAchatUseCase
            ->executer($donnees);

        return response()->json($achat, 201);
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'fournisseur_id' => ['sometimes', 'required', 'integer', 'exists:fournisseurs,id'],
            'date_achat' => ['sometimes', 'required', 'date'],
            'montant_total' => ['nullable', 'numeric', 'min:0'],
            'observation' => ['nullable', 'string'],
        ]);

        if ($request->has('statut')) {
            return response()->json([
                'message' => 'Le statut d’un achat ne peut pas être modifié directement.'
            ], 422);
        }

        $achat = $this->modifierAchatUseCase
            ->executer($achat, $donnees);

        return response()->json($achat);
    }

    public function destroy(int $id): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        try {
            $this->supprimerAchatUseCase->executer($achat);

            return response()->json([
                'message' => 'Achat supprimé avec succès.'
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }

    public function confirmer(int $id): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        try {
            $achat = $this->confirmerAchatUseCase->executer($achat);

            return response()->json([
                'message' => 'Achat confirmé avec succès.',
                'achat' => $achat
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }

    public function annuler(int $id): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        try {
            $achat = $this->annulerAchatUseCase->executer($achat);

            return response()->json([
                'message' => 'Achat annulé avec succès.',
                'achat' => $achat
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }   

}   