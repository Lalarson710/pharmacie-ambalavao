<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facture extends Model
{
    protected $fillable = [
        'vente_id',
        'numero',
        'date_facture',
        'montant_total',
        'statut',
    ];

    public function reglements(): HasMany
    {
        return $this->hasMany(Reglement::class);
    }

    protected function casts(): array
    {
        return [
            'date_facture' => 'date',
            'montant_total' => 'decimal:2',
        ];
    }

    public function vente(): BelongsTo
    {
        return $this->belongsTo(Vente::class);
    }
}