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
use App\Application\Achat\Ports\AchatStatutRepositoryInterface;

class AchatController extends Controller
{
    public function __construct(
        private ListerAchatsUseCase $listerAchatsUseCase,
        private TrouverAchatUseCase $trouverAchatUseCase,
        private CreerAchatUseCase $creerAchatUseCase,
        private ModifierAchatUseCase $modifierAchatUseCase,
        private SupprimerAchatUseCase $supprimerAchatUseCase,
        private ConfirmerAchatUseCase $confirmerAchatUseCase,
        private AnnulerAchatUseCase $annulerAchatUseCase,
        private AchatStatutRepositoryInterface $achatStatutRepository,
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

        $this->achatStatutRepository->creer([
            'achat_id' => $achat->id,
            'statut_precedent' => null,
            'nouveau_statut' => $achat->statut ?? 'brouillon',
            'commentaire' => 'Achat créé',
            'utilisateur_id' => $request->user()->id,
        ]);

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

    public function confirmer(int $id, Request $request): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        try {
            $achat = $this->confirmerAchatUseCase->executer($achat);

            $this->achatStatutRepository->creer([
                'achat_id' => $achat->id,
                'statut_precedent' => 'brouillon',
                'nouveau_statut' => 'confirme',
                'commentaire' => 'Achat confirmé',
                'utilisateur_id' => $request->user()->id,
            ]);

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

    public function annuler(int $id, Request $request): JsonResponse
    {
        $achat = $this->trouverAchatUseCase->executer($id);

        if (!$achat) {
            return response()->json([
                'message' => 'Achat introuvable.'
            ], 404);
        }

        try {
            $achat = $this->annulerAchatUseCase->executer($achat);

            $this->achatStatutRepository->creer([
                'achat_id' => $achat->id,
                'statut_precedent' => $achat->statut === 'annule' ? 'brouillon' : 'confirme',
                'nouveau_statut' => 'annule',
                'commentaire' => 'Achat annulé',
                'utilisateur_id' => $request->user()->id,
            ]);

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
