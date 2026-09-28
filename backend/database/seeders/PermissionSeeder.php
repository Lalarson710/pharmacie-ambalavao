<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Delete old permission codes that have been renamed
        Permission::whereIn('code', [
            'stock.entry',
            'stock.exit',
        ])->delete();

        $permissions = [
            // ============================================================
            // FOURNISSEURS
            // ============================================================
            ['code' => 'fournisseur.view', 'nom' => 'Consulter les fournisseurs'],
            ['code' => 'fournisseur.create', 'nom' => 'Créer un fournisseur'],
            ['code' => 'fournisseur.update', 'nom' => 'Modifier un fournisseur'],
            ['code' => 'fournisseur.delete', 'nom' => 'Supprimer un fournisseur'],

            // ============================================================
            // PRODUITS
            // ============================================================
            ['code' => 'produit.view', 'nom' => 'Consulter les produits'],
            ['code' => 'produit.create', 'nom' => 'Créer un produit'],
            ['code' => 'produit.update', 'nom' => 'Modifier un produit'],
            ['code' => 'produit.delete', 'nom' => 'Supprimer un produit'],

            // CATÉGORIES
            ['code' => 'categorie.view', 'nom' => 'Consulter les catégories'],
            ['code' => 'categorie.create', 'nom' => 'Créer une catégorie'],
            ['code' => 'categorie.update', 'nom' => 'Modifier une catégorie'],
            ['code' => 'categorie.delete', 'nom' => 'Supprimer une catégorie'],

            // UNITÉS
            ['code' => 'unite.view', 'nom' => 'Consulter les unités'],
            ['code' => 'unite.create', 'nom' => 'Créer une unité'],
            ['code' => 'unite.update', 'nom' => 'Modifier une unité'],
            ['code' => 'unite.delete', 'nom' => 'Supprimer une unité'],

            // LOTS
            ['code' => 'lot.view', 'nom' => 'Consulter les lots'],
            ['code' => 'lot.create', 'nom' => 'Créer un lot'],
            ['code' => 'lot.update', 'nom' => 'Modifier un lot'],
            ['code' => 'lot.delete', 'nom' => 'Supprimer un lot'],

            // ============================================================
            // CLIENTS
            // ============================================================
            ['code' => 'client.view', 'nom' => 'Consulter les clients'],
            ['code' => 'client.create', 'nom' => 'Créer un client'],
            ['code' => 'client.update', 'nom' => 'Modifier un client'],
            ['code' => 'client.delete', 'nom' => 'Supprimer un client'],

            // ============================================================
            // ACHATS
            // ============================================================
            ['code' => 'achat.view', 'nom' => 'Consulter les achats'],
            ['code' => 'achat.create', 'nom' => 'Créer un achat'],
            ['code' => 'achat.update', 'nom' => 'Modifier un achat'],
            ['code' => 'achat.delete', 'nom' => 'Supprimer un achat'],
            ['code' => 'achat.print', 'nom' => 'Imprimer un achat'],

            // LIGNES D'ACHAT
            ['code' => 'achat_ligne.view', 'nom' => 'Consulter les lignes d\'achat'],
            ['code' => 'achat_ligne.create', 'nom' => 'Créer une ligne d\'achat'],
            ['code' => 'achat_ligne.update', 'nom' => 'Modifier une ligne d\'achat'],
            ['code' => 'achat_ligne.delete', 'nom' => 'Supprimer une ligne d\'achat'],

            // STATUTS ACHAT
            ['code' => 'achat_statut.view', 'nom' => 'Consulter les statuts d\'achat'],
            ['code' => 'achat_statut.create', 'nom' => 'Créer un statut d\'achat'],
            ['code' => 'achat_statut.update', 'nom' => 'Modifier un statut d\'achat'],
            ['code' => 'achat_statut.delete', 'nom' => 'Supprimer un statut d\'achat'],

            // ============================================================
            // STOCK
            // ============================================================
            ['code' => 'stock.view', 'nom' => 'Consulter le stock'],
            ['code' => 'stock.entry.view', 'nom' => 'Consulter les entrées de stock'],
            ['code' => 'stock.entry.create', 'nom' => 'Enregistrer une entrée de stock'],
            ['code' => 'stock.exit.view', 'nom' => 'Consulter les sorties de stock'],
            ['code' => 'stock.exit.create', 'nom' => 'Enregistrer une sortie de stock'],
            ['code' => 'stock.inventory', 'nom' => 'Effectuer un inventaire'],
            ['code' => 'stock.export', 'nom' => 'Exporter le stock (PDF)'],

            // MOUVEMENTS DE STOCK
            ['code' => 'mouvement_stock.view', 'nom' => 'Consulter les mouvements de stock'],
            ['code' => 'mouvement_stock.create', 'nom' => 'Créer un mouvement de stock'],
            ['code' => 'mouvement_stock.update', 'nom' => 'Modifier un mouvement de stock'],
            ['code' => 'mouvement_stock.delete', 'nom' => 'Supprimer un mouvement de stock'],

            // INVENTAIRES
            ['code' => 'inventaire.view', 'nom' => 'Consulter les inventaires'],
            ['code' => 'inventaire.create', 'nom' => 'Créer un inventaire'],
            ['code' => 'inventaire.update', 'nom' => 'Modifier un inventaire'],
            ['code' => 'inventaire.delete', 'nom' => 'Supprimer un inventaire'],
            ['code' => 'inventaire.print', 'nom' => 'Imprimer un inventaire'],

            // ============================================================
            // VENTES
            // ============================================================
            ['code' => 'vente.view', 'nom' => 'Consulter les ventes'],
            ['code' => 'vente.create', 'nom' => 'Créer une vente'],
            ['code' => 'vente.update', 'nom' => 'Modifier une vente'],
            ['code' => 'vente.delete', 'nom' => 'Supprimer une vente'],
            ['code' => 'vente.cancel', 'nom' => 'Annuler une vente'],
            ['code' => 'vente.confirm', 'nom' => 'Confirmer une vente'],
            ['code' => 'vente.print', 'nom' => 'Imprimer une vente'],

            // LIGNES DE VENTE
            ['code' => 'vente_ligne.view', 'nom' => 'Consulter les lignes de vente'],
            ['code' => 'vente_ligne.create', 'nom' => 'Créer une ligne de vente'],
            ['code' => 'vente_ligne.update', 'nom' => 'Modifier une ligne de vente'],
            ['code' => 'vente_ligne.delete', 'nom' => 'Supprimer une ligne de vente'],

            // FACTURES
            ['code' => 'facture.view', 'nom' => 'Consulter les factures'],
            ['code' => 'facture.create', 'nom' => 'Créer une facture'],
            ['code' => 'facture.update', 'nom' => 'Modifier une facture'],
            ['code' => 'facture.delete', 'nom' => 'Supprimer une facture'],
            ['code' => 'facture.print', 'nom' => 'Imprimer une facture'],

            // RÈGLEMENTS
            ['code' => 'reglement.view', 'nom' => 'Consulter les règlements'],
            ['code' => 'reglement.create', 'nom' => 'Enregistrer un règlement'],
            ['code' => 'reglement.update', 'nom' => 'Modifier un règlement'],
            ['code' => 'reglement.delete', 'nom' => 'Supprimer un règlement'],

            // ============================================================
            // CAISSE
            // ============================================================
            ['code' => 'caisse.view', 'nom' => 'Consulter les caisses'],
            ['code' => 'caisse.create', 'nom' => 'Créer une caisse'],
            ['code' => 'caisse.update', 'nom' => 'Modifier une caisse'],
            ['code' => 'caisse.delete', 'nom' => 'Supprimer une caisse'],
            ['code' => 'caisse.open', 'nom' => 'Ouvrir la caisse'],
            ['code' => 'caisse.close', 'nom' => 'Fermer la caisse'],
            ['code' => 'caisse.print', 'nom' => 'Imprimer une caisse'],

            // MOUVEMENTS DE CAISSE
            ['code' => 'mouvement_caisse.view', 'nom' => 'Consulter les mouvements de caisse'],
            ['code' => 'mouvement_caisse.create', 'nom' => 'Créer un mouvement de caisse'],
            ['code' => 'mouvement_caisse.update', 'nom' => 'Modifier un mouvement de caisse'],
            ['code' => 'mouvement_caisse.delete', 'nom' => 'Supprimer un mouvement de caisse'],

            // ============================================================
            // PERSONNEL
            // ============================================================
            ['code' => 'personnel.view', 'nom' => 'Consulter le personnel'],
            ['code' => 'personnel.create', 'nom' => 'Créer un personnel'],
            ['code' => 'personnel.update', 'nom' => 'Modifier un personnel'],
            ['code' => 'personnel.delete', 'nom' => 'Supprimer un personnel'],

            // RÔLES
            ['code' => 'role.view', 'nom' => 'Consulter les rôles'],
            ['code' => 'role.create', 'nom' => 'Créer un rôle'],
            ['code' => 'role.update', 'nom' => 'Modifier un rôle'],
            ['code' => 'role.delete', 'nom' => 'Supprimer un rôle'],

            // UTILISATEURS
            ['code' => 'user.view', 'nom' => 'Consulter les utilisateurs'],
            ['code' => 'user.create', 'nom' => 'Créer un utilisateur'],
            ['code' => 'user.update', 'nom' => 'Modifier un utilisateur'],
            ['code' => 'user.delete', 'nom' => 'Supprimer un utilisateur'],

            // PERMISSIONS
            ['code' => 'permission.view', 'nom' => 'Consulter les permissions'],
            ['code' => 'permission.create', 'nom' => 'Créer une permission'],
            ['code' => 'permission.update', 'nom' => 'Modifier une permission'],
            ['code' => 'permission.delete', 'nom' => 'Supprimer une permission'],
            ['code' => 'permission.manage', 'nom' => 'Gérer les permissions (attribution)'],

            // ============================================================
            // ALERTES
            // ============================================================
            ['code' => 'alerte.view', 'nom' => 'Consulter les alertes'],
            ['code' => 'alerte.create', 'nom' => 'Créer une alerte'],
            ['code' => 'alerte.update', 'nom' => 'Modifier une alerte'],
            ['code' => 'alerte.delete', 'nom' => 'Supprimer une alerte'],

            // ============================================================
            // TABLEAU DE BORD
            // ============================================================
            ['code' => 'dashboard.view', 'nom' => 'Consulter le tableau de bord'],

            // ============================================================
            // SAUVEGARDES
            // ============================================================
            ['code' => 'sauvegarde.view', 'nom' => 'Consulter les sauvegardes'],
            ['code' => 'sauvegarde.create', 'nom' => 'Créer une sauvegarde'],
            ['code' => 'sauvegarde.update', 'nom' => 'Modifier une sauvegarde'],
            ['code' => 'sauvegarde.delete', 'nom' => 'Supprimer une sauvegarde'],
            ['code' => 'sauvegarde.restore', 'nom' => 'Restaurer une sauvegarde'],
            ['code' => 'sauvegarde.import', 'nom' => 'Importer une sauvegarde'],

            // ============================================================
            // STATISTIQUES
            // ============================================================
            ['code' => 'statistique.view', 'nom' => 'Consulter les statistiques'],
            ['code' => 'statistique.create', 'nom' => 'Créer une statistique'],
            ['code' => 'statistique.update', 'nom' => 'Modifier une statistique'],
            ['code' => 'statistique.delete', 'nom' => 'Supprimer une statistique'],
            ['code' => 'statistique.export', 'nom' => 'Exporter les statistiques'],
            ['code' => 'statistique.print', 'nom' => 'Imprimer les statistiques'],

            // ============================================================
            // RAPPORTS
            // ============================================================
            ['code' => 'rapport.view', 'nom' => 'Consulter les rapports'],
            ['code' => 'rapport.create', 'nom' => 'Créer un rapport'],
            ['code' => 'rapport.update', 'nom' => 'Modifier un rapport'],
            ['code' => 'rapport.delete', 'nom' => 'Supprimer un rapport'],
            ['code' => 'rapport.export', 'nom' => 'Exporter les rapports'],
            ['code' => 'rapport.print', 'nom' => 'Imprimer un rapport'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['code' => $permission['code']],
                ['nom' => $permission['nom']]
            );
        }
    }
}