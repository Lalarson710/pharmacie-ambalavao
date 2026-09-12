<?php

namespace App\Application\Vente\Ports;

use App\Models\VenteLigne;

interface VenteLigneRepositoryInterface
{
    public function listerParVente(int $venteId): array;

    public function trouverParId(int $id): ?VenteLigne;

    public function creer(array $donnees): VenteLigne;

    public function supprimer(VenteLigne $ligne): bool;
}