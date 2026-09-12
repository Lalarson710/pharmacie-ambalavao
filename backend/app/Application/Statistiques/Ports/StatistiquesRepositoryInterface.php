<?php

namespace App\Application\Statistiques\Ports;

interface StatistiquesRepositoryInterface
{
    public function ventes(string $dateDebut, string $dateFin): array;

    public function produitsPlusVendus(
        string $dateDebut,
        string $dateFin
    ): array;

    public function chiffreAffaires(
        string $dateDebut,
        string $dateFin
    ): array;
}