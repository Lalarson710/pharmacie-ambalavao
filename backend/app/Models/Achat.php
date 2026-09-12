<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Achat extends Model
{
    protected $fillable = [
        'fournisseur_id',
        'numero',
        'date_achat',
        'montant_total',
        'statut',
        'observation',
    ];

    protected function casts(): array
    {
        return [
            'date_achat' => 'date',
            'montant_total' => 'decimal:2',
        ];
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(AchatLigne::class);
    }
}