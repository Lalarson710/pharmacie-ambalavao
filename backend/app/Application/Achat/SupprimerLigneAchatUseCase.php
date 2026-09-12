<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatLigneRepositoryInterface;
use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\AchatLigne;
use RuntimeException;

class SupprimerLigneAchatUseCase
{
    public function __construct(
        private AchatLigneRepositoryInterface $achatLigneRepository,
        private AchatRepositoryInterface $achatRepository
    ) {
    }

    public function executer(AchatLigne $ligne): void
    {
        $achat = $ligne->achat;

        if ($achat->statut !== 'brouillon') {
            throw new RuntimeException(
                'Impossible de supprimer une ligne d’un achat qui n’est plus en brouillon.'
            );
        }

        $this->achatLigneRepository->supprimer($ligne);

        $achat = $this->achatRepository->trouverParId($achat->id);

        $nouveauTotal = $achat->lignes()
            ->sum('montant');

        $this->achatRepository->modifier(
            $achat,
            [
                'montant_total' => $nouveauTotal,
            ]
        );
    }
}