<?php

namespace App\Infrastructure\Produit;

use App\Application\Produit\Ports\ProduitConditionnementRepositoryInterface;
use App\Models\ProduitConditionnement;

class ProduitConditionnementRepository implements ProduitConditionnementRepositoryInterface
{
    public function lister(): array
    {
        return ProduitConditionnement::with(['produit', 'unite'])->get()->all();
    }

    public function listerParProduit(int $produitId): array
    {
        return ProduitConditionnement::with('unite')
            ->where('produit_id', $produitId)
            ->where('actif', true)
            ->orderBy('quantite_base')
            ->get()
            ->all();
    }

    public function trouverParId(int $id): ?ProduitConditionnement
    {
        return ProduitConditionnement::with(['produit', 'unite'])->find($id);
    }

    public function trouverParProduitEtUnite(int $produitId, int $uniteId): ?ProduitConditionnement
    {
        return ProduitConditionnement::where('produit_id', $produitId)
            ->where('unite_id', $uniteId)
            ->first();
    }

    public function creer(array $donnees): ProduitConditionnement
    {
        $conditionnement = ProduitConditionnement::create($donnees);

        return $conditionnement->load(['produit', 'unite']);
    }

    public function modifier(ProduitConditionnement $conditionnement, array $donnees): ProduitConditionnement
    {
        $conditionnement->update($donnees);

        return $conditionnement->fresh(['produit', 'unite']);
    }

    public function supprimer(ProduitConditionnement $conditionnement): bool
    {
        return (bool) $conditionnement->delete();
    }

    public function getUniteBase(int $produitId): ?ProduitConditionnement
    {
        return ProduitConditionnement::where('produit_id', $produitId)
            ->where('est_unite_base', true)
            ->first();
    }
}