<?php

namespace App\Application\MouvementStock;

use App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Models\MouvementStock;
use Illuminate\Support\Facades\DB;

class CreerMouvementStockUseCase
{
    public function __construct(
        private MouvementStockRepositoryInterface $mouvementStockRepository,
        private LotRepositoryInterface $lotRepository
    ) {
    }

    public function executer(array $donnees): MouvementStock
    {
        return DB::transaction(function () use ($donnees) {

            $lot = $this->lotRepository->trouverParId($donnees['lot_id']);

            if (!$lot) {
                throw new \InvalidArgumentException('Lot introuvable.');
            }

            $nouvelleQuantite = $lot->quantite;

            if ($donnees['type'] === 'entree') {
                $nouvelleQuantite += $donnees['quantite'];
            }

            if ($donnees['type'] === 'sortie') {
                $nouvelleQuantite -= $donnees['quantite'];
            }

            if ($donnees['type'] === 'ajustement') {
                $nouvelleQuantite = $donnees['quantite'];
            }

            if ($nouvelleQuantite < 0) {
                throw new \RuntimeException(
                    'Stock insuffisant pour cette sortie.'
                );
            }

            $this->lotRepository->modifierQuantite(
                $lot,
                $nouvelleQuantite
            );

            return $this->mouvementStockRepository->creer($donnees);
        });
    }
}