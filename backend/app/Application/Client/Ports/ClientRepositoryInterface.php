<?php

namespace App\Application\Client\Ports;

use App\Models\Client;

interface ClientRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Client;

    public function creer(array $donnees): Client;

    public function modifier(Client $client, array $donnees): Client;

    public function supprimer(Client $client): bool;
}