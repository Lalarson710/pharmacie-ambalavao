<?php

namespace App\Application\Client;

use App\Application\Client\Ports\ClientRepositoryInterface;
use App\Models\Client;

class TrouverClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $clientRepository
    ) {
    }

    public function executer(int $id): ?Client
    {
        return $this->clientRepository->trouverParId($id);
    }
}