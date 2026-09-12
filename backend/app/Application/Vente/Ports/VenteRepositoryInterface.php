<?php

namespace App\Application\Vente\Ports;

use App\Models\Vente;

interface VenteRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Vente;

    public function creer(array $donnees): Vente;

    public function modifier(Vente $vente, array $donnees): Vente;

    public function supprimer(Vente $vente): bool;
}