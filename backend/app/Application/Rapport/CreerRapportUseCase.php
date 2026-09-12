<?php

namespace App\Application\Rapport;

use App\Application\Rapport\Ports\RapportRepositoryInterface;
use App\Models\Rapport;
use RuntimeException;

class CreerRapportUseCase
{
    public function __construct(
        private RapportRepositoryInterface $rapportRepository
    ) {
    }

    public function executer(array $donnees): Rapport
    {
        if ($donnees['date_debut'] > $donnees['date_fin']) {
            throw new RuntimeException(
                'La date de début ne peut pas être après la date de fin.'
            );
        }

        return $this->rapportRepository->creer($donnees);
    }
}