<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementCaisse extends Model
{
    protected $table = 'mouvements_caisse';
    
    protected $fillable = [
        'caisse_id',
        'reglement_id',
        'type',
        'montant',
        'motif',
    ];

    protected function casts(): array
    {
        return [
            'montant' => 'decimal:2',
        ];
    }

    public function caisse(): BelongsTo
    {
        return $this->belongsTo(Caisse::class);
    }

    public function reglement(): BelongsTo
    {
        return $this->belongsTo(Reglement::class);
    }
}