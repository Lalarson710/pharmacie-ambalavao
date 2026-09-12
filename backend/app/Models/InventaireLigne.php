<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventaireLigne extends Model
{
    protected $table = 'inventaires_lignes';

    protected $fillable = [
        'inventaire_id',
        'lot_id',
        'quantite_theorique',
        'quantite_reelle',
        'ecart',
    ];

    public function inventaire(): BelongsTo
    {
        return $this->belongsTo(Inventaire::class);
    }

    public function lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class);
    }
}