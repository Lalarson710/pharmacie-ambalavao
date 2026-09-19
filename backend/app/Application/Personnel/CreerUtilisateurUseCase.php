<?php

namespace App\Application\Personnel;

use App\Application\Personnel\Ports\UserRepositoryInterface;
use App\Models\Permission;
use App\Models\User;
use RuntimeException;

class CreerUtilisateurUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {
    }

    public function executer(array $donnees): User
    {
        $utilisateurExistant = $this->userRepository
            ->trouverParEmail($donnees['email']);

        if ($utilisateurExistant) {
            throw new RuntimeException(
                'Un utilisateur avec cet email existe déjà.'
            );
        }

        // Créer l'utilisateur
        $user = $this->userRepository->creer($donnees);
        
        // Charger le rôle pour vérifier s'il est administrateur
        $user->load('role');
        
        // Assigner les permissions automatiquement
        $this->assignerPermissionsAutomatiques($user);
        
        return $user->fresh(['role', 'permissions']);
    }

    private function assignerPermissionsAutomatiques(User $user): void
    {
        $toutesPermissions = Permission::all();
        
        $estAdmin = $user->role && $user->role->nom === 'administrateur';
        
        $permissionsPersonnel = [
            'personnel.view',
            'personnel.create',
            'personnel.update',
            'personnel.delete',
        ];
        
        $syncData = [];
        
        foreach ($toutesPermissions as $permission) {
            $autorise = true;
            
            if (!$estAdmin && in_array($permission->code, $permissionsPersonnel)) {
                $autorise = false;
            }
            
            $syncData[$permission->id] = ['autorise' => $autorise];
        }
        
        $user->permissions()->sync($syncData);
    }
}
