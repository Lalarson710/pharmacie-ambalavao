<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Role extends Model
{
    protected $fillable = [
        'nom',
        'nom_affichage',
    ];
    
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'role_id',
            'permission_id'
        );
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }
}