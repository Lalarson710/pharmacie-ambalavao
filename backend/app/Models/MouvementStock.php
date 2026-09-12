<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MouvementStock extends Model
{
    protected $table = 'mouvements_stock';

    protected $fillable = [
        'lot_id',
        'type',
        'quantite',
        'motif',
    ];

    public function lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class);
    }
}