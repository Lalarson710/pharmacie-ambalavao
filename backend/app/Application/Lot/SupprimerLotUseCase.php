<?php

namespace App\Application\Lot;

use App\Application\Lot\Ports\LotRepositoryInterface;

class SupprimerLotUseCase
{
    public function __construct(
        private LotRepositoryInterface $lotRepository
    ) {
    }

    public function executer(int $id): ?string
    {
        $lot = $this->lotRepository->trouverParId($id);

        if (!$lot) {
            return null;
        }

        if ($lot->ventesLignes()->exists()) {
            return 'Ce lot ne peut pas être supprimé car il est lié à une ou plusieurs ventes.';
        }

        if ($lot->mouvementsStock()->exists() || $lot->lignesInventaire()->exists()) {
            return 'Ce lot ne peut pas être supprimé car il est lié au stock.';
        }

        return $this->lotRepository->supprimer($lot) ? 'ok' : null;
    }
}
