<?php

namespace App\Application\Personnel\Ports;

use App\Models\Personnel;

interface PersonnelRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Personnel;

    public function creer(array $donnees): Personnel;

    public function modifier(
        Personnel $personnel,
        array $donnees
    ): Personnel;

    public function supprimer(Personnel $personnel): bool;
}