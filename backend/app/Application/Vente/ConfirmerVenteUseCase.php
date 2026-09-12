<?php

namespace App\Application\Vente;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ConfirmerVenteUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository,
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(Vente $vente): Vente
    {
        return DB::transaction(function () use ($vente) {

            if ($vente->statut !== 'brouillon') {
                throw new RuntimeException(
                    'Seule une vente en brouillon peut être confirmée.'
                );
            }

            if ($vente->lignes()->count() === 0) {
                throw new RuntimeException(
                    'Impossible de confirmer une vente sans ligne.'
                );
            }

            $vente = $this->venteRepository->modifier(
                $vente,
                [
                    'statut' => 'confirmee',
                ]
            );

            $this->factureRepository->creer([
                'vente_id' => $vente->id,
                'numero' => 'FAC-' . date('Y') . '-' .
                    str_pad($vente->id, 3, '0', STR_PAD_LEFT),
                'date_facture' => now()->toDateString(),
                'montant_total' => $vente->montant_total,
                'statut' => 'impayee',
            ]);

            return $vente;
        });
    }
}