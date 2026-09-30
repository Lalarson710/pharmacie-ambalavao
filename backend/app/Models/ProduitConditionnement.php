<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProduitConditionnement extends Model
{
    protected $table = 'produit_conditionnements';

    protected $fillable = [
        'produit_id',
        'unite_id',
        'quantite_base',
        'prix_vente',
        'code_barres',
        'est_unite_base',
        'actif',
    ];

    protected function casts(): array
    {
        return [
            'quantite_base' => 'integer',
            'prix_vente' => 'decimal:2',
            'est_unite_base' => 'boolean',
            'actif' => 'boolean',
        ];
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function unite(): BelongsTo
    {
        return $this->belongsTo(Unite::class);
    }

    public function achatLignes(): HasMany
    {
        return $this->hasMany(AchatLigne::class, 'conditionnement_id');
    }

    public function ventesLignes(): HasMany
    {
        return $this->hasMany(VenteLigne::class, 'conditionnement_id');
    }
}