<?php

namespace App\Application\Vente;

use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Application\Vente\Ports\VenteLigneRepositoryInterface;
use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\VenteLigne;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SupprimerLigneVenteUseCase
{
    public function __construct(
        private VenteLigneRepositoryInterface $venteLigneRepository,
        private VenteRepositoryInterface $venteRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
    ) {
    }

    public function executer(VenteLigne $ligne): void
    {
        DB::transaction(function () use ($ligne) {

            $vente = $this->venteRepository
                ->trouverParId($ligne->vente_id);

            if (!$vente) {
                throw new RuntimeException(
                    'Vente introuvable.'
                );
            }

            if ($vente->statut !== 'brouillon') {
                throw new RuntimeException(
                    'Impossible de supprimer une ligne d’une vente qui n’est plus en brouillon.'
                );
            }

            $lot = $this->lotRepository
                ->trouverParId($ligne->lot_id);

            if (!$lot) {
                throw new RuntimeException(
                    'Lot introuvable.'
                );
            }

            // Remettre la quantité dans le stock
            $this->creerMouvementStockUseCase->executer([
                'lot_id' => $lot->id,
                'type' => 'entree',
                'quantite' => $ligne->quantite,
                'motif' => 'Annulation de la ligne de vente',
            ]);

            // Supprimer la ligne
            $this->venteLigneRepository
                ->supprimer($ligne);

            // Recalculer le total de la vente
            $vente = $this->venteRepository
                ->trouverParId($vente->id);

            $nouveauTotal = $vente->lignes->sum('montant');

            $this->venteRepository->modifier(
                $vente,
                [
                    'montant_total' => $nouveauTotal,
                ]
            );
        });
    }
}