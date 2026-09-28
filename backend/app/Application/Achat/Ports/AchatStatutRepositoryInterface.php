<?php

namespace App\Application\Achat\Ports;

use App\Models\AchatStatut;

interface AchatStatutRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?AchatStatut;

    public function creer(array $donnees): AchatStatut;

    public function modifier(
        AchatStatut $achatStatut,
        array $donnees
    ): AchatStatut;

    public function supprimer(AchatStatut $achatStatut): bool;

    public function listerParAchat(int $achatId): array;
}
