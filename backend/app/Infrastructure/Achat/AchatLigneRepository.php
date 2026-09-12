<?php

namespace App\Infrastructure\Achat;

use App\Application\Achat\Ports\AchatLigneRepositoryInterface;
use App\Models\AchatLigne;

class AchatLigneRepository implements AchatLigneRepositoryInterface
{
    public function listerParAchat(int $achatId): array
    {
        return AchatLigne::with('produit')
            ->where('achat_id', $achatId)
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?AchatLigne
    {
        return AchatLigne::with('produit')->find($id);
    }

    public function creer(array $donnees): AchatLigne
    {
        return AchatLigne::create($donnees)
            ->load('produit');
    }

    public function supprimer(AchatLigne $ligne): bool
    {
        return $ligne->delete();
    }
}