<?php

namespace App\Http\Controllers\Achat;

use App\Application\Achat\Ports\AchatStatutRepositoryInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AchatStatutController extends Controller
{
    public function __construct(
        private AchatStatutRepositoryInterface $achatStatutRepository
    ) {
    }

    public function index(int $achatId): JsonResponse
    {
        try {
            $statuts = $this->achatStatutRepository->listerParAchat($achatId);

            return response()->json($statuts);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Une erreur est survenue: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, int $achatId): JsonResponse
    {
        $donnes = $request->validate([
            'statut_precedent' => ['nullable', 'string'],
            'nouveau_statut' => ['required', 'string'],
            'commentaire' => ['nullable', 'string'],
        ]);

        $donnes['achat_id'] = $achatId;
        $donnes['utilisateur_id'] = $request->user()->id;

        $statut = $this->achatStatutRepository->creer($donnes);

        return response()->json($statut, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $statut = $this->achatStatutRepository->trouver($id);

        if (!$statut) {
            return response()->json([
                'message' => 'Statut d\'achat introuvable.'
            ], 404);
        }

        try {
            $donnees = $request->validate([
                'statut_precedent' => ['nullable', 'string'],
                'nouveau_statut' => ['sometimes', 'string'],
                'commentaire' => ['nullable', 'string'],
            ]);

            $statut = $this->achatStatutRepository->modifier($statut, $donnees);

            return response()->json($statut);

        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        $statut = $this->achatStatutRepository->trouver($id);

        if (!$statut) {
            return response()->json([
                'message' => 'Statut d\'achat introuvable.'
            ], 404);
        }

        try {
            $this->achatStatutRepository->supprimer($statut);

            return response()->json([
                'message' => 'Statut d\'achat supprimé avec succès.'
            ]);

        } catch (\RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
