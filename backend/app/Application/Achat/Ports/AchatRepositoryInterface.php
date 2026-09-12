<?php

namespace App\Application\Achat\Ports;

use App\Models\Achat;

interface AchatRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Achat;

    public function creer(array $donnees): Achat;

    public function modifier(
        Achat $achat,
        array $donnees
    ): Achat;

    public function supprimer(Achat $achat): bool;
}