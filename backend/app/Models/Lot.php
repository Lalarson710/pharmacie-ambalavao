<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lot extends Model
{
    protected $fillable = [
        'produit_id',
        'numero_lot',
        'date_peremption',
        'quantite',
    ];

    protected function casts(): array
    {
        return [
            'date_peremption' => 'date',
            'quantite' => 'integer',
        ];
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function mouvementsStock(): HasMany
    {
        return $this->hasMany(MouvementStock::class);
    }

    public function lignesInventaire(): HasMany
    {
        return $this->hasMany(InventaireLigne::class);
    }

    public function ventesLignes(): HasMany
    {
        return $this->hasMany(VenteLigne::class);
    }
}