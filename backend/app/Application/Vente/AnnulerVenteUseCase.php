<?php

namespace App\Application\Vente;

use App\Application\Facture\Ports\FactureRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Application\Vente\Ports\VenteRepositoryInterface;
use App\Models\Vente;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AnnulerVenteUseCase
{
    public function __construct(
        private VenteRepositoryInterface $venteRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase,
        private FactureRepositoryInterface $factureRepository
    ) {
    }

    public function executer(Vente $vente): Vente
    {
        return DB::transaction(function () use ($vente) {

            if ($vente->statut === 'annulee') {
                throw new RuntimeException(
                    'Cette vente est déjà annulée.'
                );
            }

            $facture = $this->factureRepository
                ->trouverParVenteId($vente->id);

            if ($facture && $facture->reglements()->count() > 0) {
                throw new RuntimeException(
                    'Impossible d’annuler une vente dont la facture possède déjà des règlements.'
                );
            }

            // Le stock est sorti dès l'ajout de la ligne (même en brouillon)
            // -> il faut le remettre à l'annulation.
            foreach ($vente->lignes as $ligne) {

                $lot = $this->lotRepository
                    ->trouverParId($ligne->lot_id);

                if (!$lot) {
                    throw new RuntimeException(
                        'Lot associé à la ligne de vente introuvable.'
                    );
                }

                $this->creerMouvementStockUseCase->executer([
                    'lot_id' => $lot->id,
                    'type' => 'entree',
                    'quantite' => $ligne->quantite,
                    'motif' => 'Annulation de la vente ' . $vente->numero,
                ]);
            }

            if ($facture) {
                $this->factureRepository->modifier($facture, [
                    'statut' => 'annulee',
                ]);
            }

            return $this->venteRepository->modifier($vente, [
                'statut' => 'annulee',
            ]);
        });
    }
}
