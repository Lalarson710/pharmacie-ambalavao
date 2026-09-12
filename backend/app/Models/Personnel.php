<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Personnel extends Model
{
    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'telephone',
        'email',
        'adresse',
        'fonction',
        'date_embauche',
        'actif',
    ];

    protected function casts(): array
    {
        return [
            'date_embauche' => 'date',
            'actif' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}