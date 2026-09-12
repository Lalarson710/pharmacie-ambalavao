<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    protected $fillable = [
        'type',
        'date_debut',
        'date_fin',
        'montant_total',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
            'montant_total' => 'decimal:2',
        ];
    }
}