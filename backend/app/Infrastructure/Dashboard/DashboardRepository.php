<?php

namespace App\Infrastructure\Dashboard;

use App\Application\Dashboard\Ports\DashboardRepositoryInterface;
use App\Models\Facture;
use App\Models\Produit;
use App\Models\Vente;
use App\Models\Lot;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function obtenir(): array
    {
        $debut = now()->startOfDay();
        $fin = now()->endOfDay();

        $produits = Produit::where('actif', true)->get();

        $stocksFaibles = $produits->filter(function ($produit) {
            $quantite = Lot::where('produit_id', $produit->id)
                ->sum('quantite');

            return $quantite > 0 && $quantite <= $produit->stock_minimum;
        })->count();

        $ruptures = $produits->filter(function ($produit) {
            return Lot::where('produit_id', $produit->id)
                ->sum('quantite') <= 0;
        })->count();

        $peremptionsProches = Lot::where('quantite', '>', 0)
            ->whereDate(
                'date_peremption',
                '<=',
                now()->addDays(30)->toDateString()
            )
            ->count();

        return [
            'total_produits' => Produit::where('actif', true)->count(),

            'ventes_jour' => Vente::whereBetween(
                'date_vente',
                [$debut->toDateString(), $fin->toDateString()]
            )
                ->where('statut', 'confirmee')
                ->count(),

            'chiffre_affaires_jour' => (float) Vente::whereBetween(
                'date_vente',
                [$debut->toDateString(), $fin->toDateString()]
            )
                ->where('statut', 'confirmee')
                ->sum('montant_total'),

            'stocks_faibles' => $stocksFaibles,

            'ruptures' => $ruptures,

            'peremptions_proches' => $peremptionsProches,

            'factures_impayees' => Facture::whereIn(
                'statut',
                ['impayee', 'partiellement_payee']
            )->count(),
        ];
    }
}