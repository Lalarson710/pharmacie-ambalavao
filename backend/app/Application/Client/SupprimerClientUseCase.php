<?php

namespace App\Application\Client;

use App\Application\Client\Ports\ClientRepositoryInterface;
use App\Models\Client;
use RuntimeException;

class SupprimerClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository
    ) {
    }

    public function executer(Client $client): void
    {
        if ($client->ventes()->exists()) {
            throw new RuntimeException(
                'Impossible de supprimer ce client car il est utilisé dans une vente.'
            );
        }

        $this->clientRepository->supprimer($client);
    }
}