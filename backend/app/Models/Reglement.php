<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reglement extends Model
{
    protected $fillable = [
        'facture_id',
        'montant',
        'mode',
        'date_reglement',
        'reference',
    ];

    protected function casts(): array
    {
        return [
            'montant' => 'decimal:2',
            'date_reglement' => 'datetime',
        ];
    }

    public function facture(): BelongsTo
    {
        return $this->belongsTo(Facture::class);
    }

    public function mouvementCaisse(): HasOne
    {
        return $this->hasOne(MouvementCaisse::class);
    }
}