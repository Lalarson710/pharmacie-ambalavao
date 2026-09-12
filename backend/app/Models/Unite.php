<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unite extends Model
{
    protected $fillable = [
        'nom',
        'abreviation',
        'actif',
    ];

    public function produits(): HasMany
    {
        return $this->hasMany(Produit::class);
    }
}