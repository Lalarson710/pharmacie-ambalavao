<?php

namespace App\Application\Client;

use App\Application\Client\Ports\ClientRepositoryInterface;

class ListerClientsUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository
    ) {
    }

    public function executer(): array
    {
        return $this->clientRepository->lister();
    }
}