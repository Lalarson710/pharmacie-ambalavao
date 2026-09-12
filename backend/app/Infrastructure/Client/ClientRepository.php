<?php

namespace App\Infrastructure\Client;

use App\Application\Client\Ports\ClientRepositoryInterface;
use App\Models\Client;

class ClientRepository implements ClientRepositoryInterface
{
    public function lister(): array
    {
        return Client::orderBy('nom')->get()->all();
    }

    public function trouverParId(int $id): ?Client
    {
        return Client::find($id);
    }

    public function creer(array $donnees): Client
    {
        return Client::create($donnees);
    }

    public function modifier(Client $client, array $donnees): Client
    {
        $client->update($donnees);

        return $client->fresh();
    }

    public function supprimer(Client $client): bool
    {
        return $client->delete();
    }
}