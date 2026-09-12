<?php

namespace App\Infrastructure\Alertes;

use App\Application\Alertes\Ports\AlerteRepositoryInterface;
use App\Models\Lot;
use App\Models\Produit;

class AlerteRepository implements AlerteRepositoryInterface
{
    public function stockFaible(): array
    {
        return Produit::with(['lots'])
            ->where('actif', true)
            ->get()
            ->filter(function ($produit) {
                return $produit->lots->sum('quantite') > 0
                    && $produit->lots->sum('quantite') <= $produit->stock_minimum;
            })
            ->values()
            ->all();
    }

    public function ruptures(): array
    {
        return Produit::with(['lots'])
            ->where('actif', true)
            ->get()
            ->filter(function ($produit) {
                return $produit->lots->sum('quantite') <= 0;
            })
            ->values()
            ->all();
    }

    public function peremptions(int $jours): array
    {
        $dateLimite = now()->addDays($jours)->toDateString();

        return Lot::with('produit')
            ->where('quantite', '>', 0)
            ->whereDate('date_peremption', '<=', $dateLimite)
            ->orderBy('date_peremption')
            ->get()
            ->all();
    }

    public function toutes(int $jours = 30): array
    {
        return [
            'stocks_faibles' => $this->stockFaible(),
            'ruptures' => $this->ruptures(),
            'peremptions' => $this->peremptions($jours),
        ];
    }
}