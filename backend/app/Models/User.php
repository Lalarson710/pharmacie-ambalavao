<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['name', 'email', 'password', 'role_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function personnel(): HasOne
    {
        return $this->hasOne(Personnel::class);
    }
    
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'utilisateurs_permissions',
            'user_id',
            'permission_id'
        )->withPivot('autorise');
    }

    public function aLaPermission(string $code): bool
    {
        // Vérifier d'abord une éventuelle permission individuelle
        $permissionIndividuelle = $this->permissions()
            ->where('code', $code)
            ->first();

        if ($permissionIndividuelle) {
            return (bool) $permissionIndividuelle->pivot->autorise;
        }

        // Sinon, utiliser les permissions du rôle
        return $this->role
            ? $this->role->permissions()->where('code', $code)->exists()
            : false;
    }

    public function caisses(): HasMany
    {
        return $this->hasMany(Caisse::class, 'user_id');
    }
}
