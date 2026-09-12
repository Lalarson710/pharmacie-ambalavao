<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['code' => 'produit.view', 'nom' => 'Consulter les produits'],
            ['code' => 'produit.create', 'nom' => 'Créer un produit'],
            ['code' => 'produit.update', 'nom' => 'Modifier un produit'],
            ['code' => 'produit.delete', 'nom' => 'Supprimer un produit'],

            ['code' => 'stock.view', 'nom' => 'Consulter le stock'],
            ['code' => 'stock.entry', 'nom' => 'Enregistrer une entrée de stock'],
            ['code' => 'stock.exit', 'nom' => 'Enregistrer une sortie de stock'],
            ['code' => 'stock.inventory', 'nom' => 'Effectuer un inventaire'],

            ['code' => 'achat.view', 'nom' => 'Consulter les achats'],
            ['code' => 'achat.create', 'nom' => 'Créer un achat'],
            ['code' => 'achat.update', 'nom' => 'Modifier un achat'],
            ['code' => 'achat.delete', 'nom' => 'Supprimer un achat'],

            ['code' => 'vente.view', 'nom' => 'Consulter les ventes'],
            ['code' => 'vente.create', 'nom' => 'Créer une vente'],
            ['code' => 'vente.update', 'nom' => 'Modifier une vente'],
            ['code' => 'vente.cancel', 'nom' => 'Annuler une vente'],
            ['code' => 'vente.confirm', 'nom' => 'Confirmer une vente'],

            ['code' => 'caisse.open', 'nom' => 'Ouvrir la caisse'],
            ['code' => 'caisse.close', 'nom' => 'Fermer la caisse'],

            ['code' => 'client.view', 'nom' => 'Consulter les clients'],
            ['code' => 'client.create', 'nom' => 'Créer un client'],
            ['code' => 'client.update', 'nom' => 'Modifier un client'],

            ['code' => 'fournisseur.view', 'nom' => 'Consulter les fournisseurs'],
            ['code' => 'fournisseur.create', 'nom' => 'Créer un fournisseur'],
            ['code' => 'fournisseur.update', 'nom' => 'Modifier un fournisseur'],
            ['code' => 'fournisseur.delete', 'nom' => 'Supprimer un fournisseur'],

            ['code' => 'rapport.view', 'nom' => 'Consulter les rapports'],
            ['code' => 'rapport.export', 'nom' => 'Exporter les rapports'],

            ['code' => 'personnel.view', 'nom' => 'Consulter le personnel'],
            ['code' => 'personnel.create', 'nom' => 'Créer un personnel'],
            ['code' => 'personnel.update', 'nom' => 'Modifier un personnel'],
            ['code' => 'personnel.delete', 'nom' => 'Supprimer un personnel'],

            ['code' => 'user.view', 'nom' => 'Consulter les utilisateurs'],
            ['code' => 'user.create', 'nom' => 'Créer un utilisateur'],
            ['code' => 'user.update', 'nom' => 'Modifier un utilisateur'],
            ['code' => 'user.delete', 'nom' => 'Supprimer un utilisateur'],

            ['code' => 'permission.manage', 'nom' => 'Gérer les permissions'],
            
            ['code' => 'client.view', 'nom' => 'Consulter les clients'],
            ['code' => 'client.create', 'nom' => 'Créer un client'],
            ['code' => 'client.update', 'nom' => 'Modifier un client'],
            ['code' => 'client.delete', 'nom' => 'Supprimer un client'],

            ['code' => 'alerte.view', 'nom' => 'Consulter les alertes'],
            
            ['code' => 'dashboard.view', 'nom' => 'Consulter le tableau de bord'],

            ['code' => 'sauvegarde.view', 'nom' => 'Consulter les sauvegardes'],
            ['code' => 'sauvegarde.create', 'nom' => 'Créer une sauvegarde'],
            ['code' => 'sauvegarde.restore', 'nom' => 'Restaurer une sauvegarde'],

            ['code' => 'statistique.view', 'nom' => 'Consulter les statistiques'],

            ['code' => 'facture.print', 'nom' => 'Imprimer une facture'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['code' => $permission['code']],
                ['nom' => $permission['nom']]
            );
        }
    }
}