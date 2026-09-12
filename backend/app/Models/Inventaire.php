<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventaire extends Model
{
    protected $fillable = [
        'date_inventaire',
        'motif',
    ];

    protected function casts(): array
    {
        return [
            'date_inventaire' => 'date',
        ];
    }

    public function lignes(): HasMany
    {
        return $this->hasMany(InventaireLigne::class);
    }
}