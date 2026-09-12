<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use App\Models\Achat;
use RuntimeException;
use Illuminate\Support\Facades\DB;

class AnnulerAchatUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
    ) {
    }

    public function executer(Achat $achat): Achat
    {
        return DB::transaction(function () use ($achat) {

            if ($achat->statut === 'brouillon') {
                return $this->achatRepository->modifier(
                    $achat,
                    ['statut' => 'annule']
                );
            }

            if ($achat->statut !== 'confirme') {
                throw new RuntimeException(
                    'Seul un achat brouillon ou confirmé peut être annulé.'
                );
            }

            foreach ($achat->lignes as $ligne) {

                $lot = $this->lotRepository->trouverParId(
                    $this->lotRepository
                        ->trouverParProduitEtNumeroLot(
                            $ligne->produit_id,
                            $ligne->numero_lot
                        )?->id
                );

                if (!$lot) {
                    throw new RuntimeException(
                        'Lot associé à la ligne d’achat introuvable.'
                    );
                }

                if ($lot->quantite < $ligne->quantite) {
                    throw new RuntimeException(
                        'Stock insuffisant pour annuler cet achat.'
                    );
                }

                $this->creerMouvementStockUseCase->executer([
                    'lot_id' => $lot->id,
                    'type' => 'sortie',
                    'quantite' => $ligne->quantite,
                    'motif' => 'Sortie suite à l’annulation de l’achat',
                ]);
            }

            return $this->achatRepository->modifier(
                $achat,
                ['statut' => 'annule']
            );
        });
    }
}