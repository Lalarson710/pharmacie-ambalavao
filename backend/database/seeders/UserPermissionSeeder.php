<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@pharmacie-ambalavao.mg')->first();
        
        if (!$admin) {
            $this->command->warn('Utilisateur admin non trouvé');
            return;
        }

        // Récupérer toutes les permissions
        $allPermissions = Permission::all();
        
        // Assigner toutes les permissions à l'admin (avec autorise = true)
        $syncData = [];
        foreach ($allPermissions as $permission) {
            $syncData[$permission->id] = ['autorise' => true];
        }
        
        $admin->permissions()->sync($syncData);
        
        $this->command->info('Toutes les permissions assignées à l\'admin dans utilisateurs_permissions');
    }
}
