<?php

namespace App\Application\Inventaire;

use App\Application\Inventaire\Ports\InventaireRepositoryInterface;
use App\Application\Lot\Ports\LotRepositoryInterface;
use App\Models\Inventaire;
use App\Application\MouvementStock\CreerMouvementStockUseCase;
use Illuminate\Support\Facades\DB;

class AjouterLigneInventaireUseCase
{
    public function __construct(
        private InventaireRepositoryInterface $inventaireRepository,
        private LotRepositoryInterface $lotRepository,
        private CreerMouvementStockUseCase $creerMouvementStockUseCase
    ) {
    }

    public function executer(
        int $inventaireId,
        array $donnees
        ): Inventaire {
        return DB::transaction(function () use ($inventaireId, $donnees) {

            $inventaire = $this->inventaireRepository->trouverParId($inventaireId);

            if (!$inventaire) {
                throw new \InvalidArgumentException('Inventaire introuvable.');
            }

            $lot = $this->lotRepository->trouverParId($donnees['lot_id']);

            if (!$lot) {
                throw new \InvalidArgumentException('Lot introuvable.');
            }

            $quantiteTheorique = $lot->quantite;

            $donnees['quantite_theorique'] = $quantiteTheorique;

            $donnees['ecart'] =
                $donnees['quantite_reelle'] - $quantiteTheorique;

            $this->creerMouvementStockUseCase->executer([
                'lot_id' => $donnees['lot_id'],
                'type' => 'ajustement',
                'quantite' => $donnees['quantite_reelle'],
                'motif' => 'Ajustement suite à un inventaire',
            ]);

            return $this->inventaireRepository->ajouterLigne(
                $inventaireId,
                $donnees
            );
        });
    }
}       