<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('nom', 'administrateur')->first();

        User::updateOrCreate(
            ['email' => 'admin@pharmacie-ambalavao.mg'],
            [
                'name' => 'Administrateur',
                'password' => 'Admin123!',
                'role_id' => $role->id,
            ]
        );
    }
}