<?php

namespace App\Application\Unite;

use App\Application\Unite\Ports\UniteRepositoryInterface;

class SupprimerUniteUseCase
{
    public function __construct(
        private UniteRepositoryInterface $uniteRepository
    ) {
    }

    public function executer(int $id): ?string
    {
        $unite = $this->uniteRepository->trouverParId($id);

        if (!$unite) {
            return null;
        }

        if ($unite->produits()->exists()) {
            return 'Cette unité ne peut pas être supprimée car elle est utilisée par un ou plusieurs produits.';
        }

        return $this->uniteRepository->supprimer($unite) ? 'ok' : null;
    }

}
