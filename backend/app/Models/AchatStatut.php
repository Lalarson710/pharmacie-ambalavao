<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AchatStatut extends Model
{
    protected $table = 'achat_statuts';

    protected $fillable = [
        'achat_id',
        'statut_precedent',
        'nouveau_statut',
        'commentaire',
        'utilisateur_id',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function achat(): BelongsTo
    {
        return $this->belongsTo(Achat::class);
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
