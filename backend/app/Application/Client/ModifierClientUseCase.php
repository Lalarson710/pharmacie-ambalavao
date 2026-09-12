<?php

namespace App\Application\Client;

use App\Application\Client\Ports\ClientRepositoryInterface;
use App\Models\Client;

class ModifierClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository
    ) {
    }

    public function executer(
        Client $client,
        array $donnees
    ): Client {
        return $this->clientRepository->modifier(
            $client,
            $donnees
        );
    }
}