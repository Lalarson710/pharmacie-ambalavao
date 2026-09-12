<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AchatLigne extends Model
{
    protected $table = 'achat_lignes';

    protected $fillable = [
        'achat_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
        'montant',
        'numero_lot',
        'date_peremption',
    ];

    protected function casts(): array
    {
        return [
            'quantite' => 'integer',
            'prix_unitaire' => 'decimal:2',
            'montant' => 'decimal:2',
            'date_peremption' => 'date',
        ];
    }

    public function achat(): BelongsTo
    {
        return $this->belongsTo(Achat::class);
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }
}