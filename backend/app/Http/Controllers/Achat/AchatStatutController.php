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
}
