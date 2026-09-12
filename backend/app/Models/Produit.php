<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    protected $fillable = [
        'categorie_id',
        'unite_id',
        'nom',
        'code_barres',
        'description',
        'prix_achat',
        'prix_vente',
        'stock_minimum',
        'actif',
    ];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }

    public function unite(): BelongsTo
    {
        return $this->belongsTo(Unite::class);
    }

    public function lots(): HasMany
    {
        return $this->hasMany(Lot::class);
    }

    public function ventesLignes(): HasMany
    {
        return $this->hasMany(VenteLigne::class);
    }
}