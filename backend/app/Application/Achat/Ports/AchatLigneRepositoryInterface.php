<?php

namespace App\Application\Achat\Ports;

use App\Models\AchatLigne;

interface AchatLigneRepositoryInterface
{
    public function listerParAchat(int $achatId): array;

    public function trouverParId(int $id): ?AchatLigne;

    public function creer(array $donnees): AchatLigne;

    public function supprimer(AchatLigne $ligne): bool;
}