<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(
            ['nom' => 'administrateur'],
            ['nom_affichage' => 'Administrateur']
        );

        Role::updateOrCreate(
            ['nom' => 'pharmacien'],
            ['nom_affichage' => 'Pharmacien']
        );

        Role::updateOrCreate(
            ['nom' => 'caissier'],
            ['nom_affichage' => 'Caissier']
        );

        Role::updateOrCreate(
            ['nom' => 'gestionnaire'],
            ['nom_affichage' => 'Gestionnaire']
        );
    }
}