<?php

namespace App\Application\Achat;

use App\Application\Achat\Ports\AchatRepositoryInterface;
use App\Models\Achat;
use RuntimeException;

class SupprimerAchatUseCase
{
    public function __construct(
        private AchatRepositoryInterface $achatRepository
    ) {
    }

    public function executer(Achat $achat): void
    {
        if ($achat->lignes()->exists()) {
            throw new RuntimeException(
                'Impossible de supprimer cet achat car il contient des lignes.'
            );
        }

        $this->achatRepository->supprimer($achat);
    }
}