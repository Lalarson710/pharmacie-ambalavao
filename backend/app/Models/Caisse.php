<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Caisse extends Model
{
    protected $fillable = [
        'user_id',
        'date_ouverture',
        'montant_initial',
        'date_fermeture',
        'montant_final',
        'ecart',
        'statut',
        'observation',
    ];

    protected function casts(): array
    {
        return [
            'date_ouverture' => 'datetime',
            'date_fermeture' => 'datetime',
            'montant_initial' => 'decimal:2',
            'montant_final' => 'decimal:2',
            'ecart' => 'decimal:2',
        ];
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function mouvements(): HasMany
    {
        return $this->hasMany(MouvementCaisse::class);
    }
}