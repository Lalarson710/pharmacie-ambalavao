<?php

namespace App\Application\Caisse\Ports;

use App\Models\Caisse;

interface CaisseRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Caisse;

    public function trouverCaisseOuverteParUtilisateur(
        int $userId
    ): ?Caisse;

    public function creer(array $donnees): Caisse;

    public function modifier(
        Caisse $caisse,
        array $donnees
    ): Caisse;

    public function calculerSoldeTheorique(int $caisseId): float;
}