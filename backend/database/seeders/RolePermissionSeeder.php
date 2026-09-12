<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $administrateur = Role::where('nom', 'administrateur')->first();
        $pharmacien = Role::where('nom', 'pharmacien')->first();
        $caissier = Role::where('nom', 'caissier')->first();
        $gestionnaire = Role::where('nom', 'gestionnaire')->first();

        $permissions = Permission::all();

        // Administrateur : toutes les permissions
        $administrateur->permissions()->sync($permissions);

        // Pharmacien
        $pharmacien->permissions()->sync(
            $permissions->whereIn('code', [
                'produit.view',
                'produit.create',
                'produit.update',
                'stock.view',
                'stock.entry',
                'stock.exit',
                'stock.inventory',
                'achat.view',
                'achat.create',
                'achat.update',
                'vente.view',
                'vente.create',
                'vente.update',
                'vente.confirm',
                'client.view',
                'client.create',
                'client.update',
                'fournisseur.view',
                'fournisseur.create',
                'fournisseur.update',
                'rapport.view',
                'rapport.export',
                'client.view',
                'client.create',
                'client.update',
                'client.delete',
                'alerte.view',
                'dashboard.view',
                'statistique.view',
                'facture.print',
            ])->values()
        );

        // Caissier
        $caissier->permissions()->sync(
            $permissions->whereIn('code', [
                'vente.view',
                'vente.create',
                'vente.update',
                'vente.confirm',
                'client.view',
                'client.create',
                'client.update',
                'caisse.open',
                'caisse.close',
                'client.view',
                'client.create',
                'client.update',
                'client.delete',
            ])->values()
        );

        // Gestionnaire
        $gestionnaire->permissions()->sync(
            $permissions->whereIn('code', [
                'produit.view',
                'stock.view',
                'stock.entry',
                'stock.exit',
                'stock.inventory',
                'achat.view',
                'achat.create',
                'achat.update',
                'fournisseur.view',
                'fournisseur.create',
                'fournisseur.update',
                'rapport.view',
                'rapport.export',
                'achat.delete',
                'fournisseur.delete',
            ])->values()
        );
    }
}