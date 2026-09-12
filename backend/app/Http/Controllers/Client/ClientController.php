<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Application\Client\ListerClientsUseCase;
use App\Application\Client\TrouverClientUseCase;
use App\Application\Client\CreerClientUseCase;
use App\Application\Client\ModifierClientUseCase;
use App\Application\Client\SupprimerClientUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class ClientController extends Controller
{
    public function __construct(
        private ListerClientsUseCase $listerClientsUseCase,
        private TrouverClientUseCase $trouverClientUseCase,
        private CreerClientUseCase $creerClientUseCase,
        private ModifierClientUseCase $modifierClientUseCase,
        private SupprimerClientUseCase $supprimerClientUseCase
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json(
            $this->listerClientsUseCase->executer()
        );
    }

    public function show(int $id): JsonResponse
    {
        $client = $this->trouverClientUseCase->executer($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable.'
            ], 404);
        }

        return response()->json($client);
    }

    public function store(Request $request): JsonResponse
    {
        $donnees = $request->validate([
            'nom' => ['required', 'string', 'max:150'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $client = $this->creerClientUseCase
            ->executer($donnees);

        return response()->json($client, 201);
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {
        $client = $this->trouverClientUseCase->executer($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable.'
            ], 404);
        }

        $donnees = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:150'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],
            'adresse' => ['nullable', 'string'],
            'actif' => ['sometimes', 'boolean'],
        ]);

        $client = $this->modifierClientUseCase
            ->executer($client, $donnees);

        return response()->json($client);
    }

    public function destroy(int $id): JsonResponse
    {
        $client = $this->trouverClientUseCase->executer($id);

        if (!$client) {
            return response()->json([
                'message' => 'Client introuvable.'
            ], 404);
        }

        try {
            $this->supprimerClientUseCase
                ->executer($client);

            return response()->json([
                'message' => 'Client supprimé avec succès.'
            ]);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 409);
        }
    }
}