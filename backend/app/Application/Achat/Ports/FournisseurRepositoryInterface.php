<?php

namespace App\Application\Achat\Ports;

use App\Models\Fournisseur;

interface FournisseurRepositoryInterface
{
    public function lister(): array;

    public function trouverParId(int $id): ?Fournisseur;

    public function creer(array $donnees): Fournisseur;

    public function modifier(
        Fournisseur $fournisseur,
        array $donnees
    ): Fournisseur;

    public function supprimer(Fournisseur $fournisseur): bool;
}