<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Vente extends Model
{
    protected $fillable = [
        'numero',
        'date_vente',
        'client_id',
        'montant_total',
        'statut',
        'observation',
    ];

    protected function casts(): array
    {
        return [
            'date_vente' => 'date',
            'montant_total' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(VenteLigne::class);
    }

    public function facture(): HasOne
    {
        return $this->hasOne(Facture::class);
    }
}