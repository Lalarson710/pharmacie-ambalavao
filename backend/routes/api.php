<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Categorie\CategorieController;
use App\Http\Controllers\Unite\UniteController;
use App\Http\Controllers\Produit\ProduitController;
use App\Http\Controllers\Lot\LotController;
use App\Http\Controllers\MouvementStock\MouvementStockController;
use App\Http\Controllers\Stock\StockController;
use App\Http\Controllers\Inventaire\InventaireController;
use App\Http\Controllers\Achat\FournisseurController;
use App\Http\Controllers\Achat\AchatController;
use App\Http\Controllers\Achat\AchatLigneController;
use App\Http\Controllers\Achat\AchatStatutController;
use App\Http\Controllers\Client\ClientController;
use App\Http\Controllers\Vente\VenteController;
use App\Http\Controllers\Vente\VenteLigneController;
use App\Http\Controllers\Facture\FactureController;
use App\Http\Controllers\Reglement\ReglementController;
use App\Http\Controllers\Caisse\CaisseController;
use App\Http\Controllers\Caisse\MouvementCaisseController;
use App\Http\Controllers\Rapport\RapportController;
use App\Http\Controllers\Personnel\UtilisateurController;
use App\Http\Controllers\Personnel\UserPermissionController;
use App\Http\Controllers\Personnel\RoleController;
use App\Http\Controllers\Personnel\PermissionController;
use App\Http\Controllers\Personnel\PersonnelController;
use App\Http\Controllers\Alertes\AlerteController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Sauvegarde\SauvegardeController;
use App\Http\Controllers\Statistiques\StatistiquesController;
use App\Http\Controllers\Facture\ImpressionFactureController;


Route::post('/login', [LoginController::class, 'login'])->name('login');

Route::get('/user', function (Request $request) {
    $user = $request->user()->load(['role', 'permissions']);
    return $user;
})->middleware('auth:sanctum');


Route::post('/logout', [LogoutController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::get('/categories', [CategorieController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:categorie.view']);
Route::post('/categories', [CategorieController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:categorie.create']);
Route::get('/categories/{id}', [CategorieController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:categorie.view']);
Route::put('/categories/{id}', [CategorieController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:categorie.update']);
Route::delete('/categories/{id}', [CategorieController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:categorie.delete']);

Route::get('/unites', [UniteController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:unite.view']);
Route::post('/unites', [UniteController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:unite.create']);
Route::get('/unites/{id}', [UniteController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:unite.view']);
Route::put('/unites/{id}', [UniteController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:unite.update']);
Route::delete('/unites/{id}', [UniteController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:unite.delete']);

Route::get('/produits', [ProduitController::class, 'index'])
    ->middleware([
        'auth:sanctum',
        'permission:produit.view'
    ]);
Route::post('/produits', [ProduitController::class, 'store'])
    ->middleware([
        'auth:sanctum',
        'permission:produit.create'
    ]);

Route::get('/produits/{id}', [ProduitController::class, 'show'])
    ->middleware([
        'auth:sanctum',
        'permission:produit.view'
    ]);

Route::put('/produits/{id}', [ProduitController::class, 'update'])
    ->middleware([
        'auth:sanctum',
        'permission:produit.update'
    ]);

Route::delete('/produits/{id}', [ProduitController::class, 'destroy'])
    ->middleware([
        'auth:sanctum',
        'permission:produit.delete'
    ]);

Route::get('/lots', [LotController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:lot.view']);
Route::get('/lots/{id}', [LotController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:lot.view']);

Route::get('/mouvements-stock', [MouvementStockController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:mouvement_stock.view']);
Route::post('/mouvements-stock', [MouvementStockController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:mouvement_stock.create']);
Route::get('/mouvements-stock/{id}', [MouvementStockController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:mouvement_stock.view']);
Route::put('/mouvements-stock/{id}', [MouvementStockController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:mouvement_stock.update']);
Route::delete('/mouvements-stock/{id}', [MouvementStockController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:mouvement_stock.delete']);

Route::get('/stocks/faibles', [StockController::class, 'stocksFaibles'])
    ->middleware(['auth:sanctum', 'permission:stock.view']);
Route::get('/stocks', [StockController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:stock.view']);
Route::get('/stocks/peremption/{jours?}', [StockController::class, 'lotsProchesPeremption'])
    ->middleware(['auth:sanctum', 'permission:stock.view']);
Route::get('/stocks/rupture', [StockController::class, 'stocksEnRupture'])
    ->middleware(['auth:sanctum', 'permission:stock.view']);
Route::get('/stocks/produits', [StockController::class, 'stockParProduit'])
    ->middleware(['auth:sanctum', 'permission:stock.view']);
Route::get('/stocks/export', [StockController::class, 'export'])
    ->middleware(['auth:sanctum', 'permission:stock.export']);

Route::get('/inventaires', [InventaireController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:inventaire.view']);
Route::get('/inventaires/{id}', [InventaireController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:inventaire.view']);
Route::post('/inventaires', [InventaireController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:inventaire.create']);
Route::put('/inventaires/{id}', [InventaireController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:inventaire.update']);
Route::delete('/inventaires/{id}', [InventaireController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:inventaire.delete']);
Route::post('/inventaires/{inventaireId}/lignes', [InventaireController::class, 'ajouterLigne'])
    ->middleware(['auth:sanctum', 'permission:inventaire.create']);
Route::get('/inventaires/{id}/impression', [InventaireController::class, 'impression'])
    ->middleware(['auth:sanctum', 'permission:inventaire.print']);

// FOURNISSEURS
Route::get('/fournisseurs', [FournisseurController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:fournisseur.view']);
Route::post('/fournisseurs', [FournisseurController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:fournisseur.create']);
Route::get('/fournisseurs/{id}', [FournisseurController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:fournisseur.view']);
Route::put('/fournisseurs/{id}', [FournisseurController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:fournisseur.update']);
Route::delete('/fournisseurs/{id}', [FournisseurController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:fournisseur.delete']);


// ACHATS
Route::get('/achats', [AchatController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:achat.view']);
Route::post('/achats', [AchatController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:achat.create']);
Route::get('/achats/{id}', [AchatController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:achat.view']);
Route::put('/achats/{id}', [AchatController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:achat.update']);
Route::delete('/achats/{id}', [AchatController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:achat.delete']);
Route::post('/achats/{id}/confirmer', [AchatController::class, 'confirmer'])
    ->middleware(['auth:sanctum', 'permission:achat.update']);
Route::post('/achats/{id}/annuler', [AchatController::class, 'annuler'])
    ->middleware(['auth:sanctum', 'permission:achat.update']);
Route::get('/achats/{id}/impression', [AchatController::class, 'impression'])
    ->middleware(['auth:sanctum', 'permission:achat.print']);

// LIGNES D'ACHAT
Route::get('/achats/{achatId}/lignes', [AchatLigneController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:achat.view']);
Route::post('/achats/{achatId}/lignes', [AchatLigneController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:achat.create']);
Route::get('/achat-lignes/{id}', [AchatLigneController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:achat.view']);
Route::put('/achat-lignes/{id}', [AchatLigneController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:achat.update']);
Route::delete('/achat-lignes/{id}', [AchatLigneController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:achat.delete']);
Route::get('/achats/{achatId}/statuts', [AchatStatutController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:achat_statut.view']);
Route::post('/achats/{achatId}/statuts', [AchatStatutController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:achat_statut.create']);
Route::put('/achat-statuts/{id}', [AchatStatutController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:achat_statut.update']);
Route::delete('/achat-statuts/{id}', [AchatStatutController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:achat_statut.delete']);

Route::get('/clients', [ClientController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:client.view']);
Route::post('/clients', [ClientController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:client.create']);
Route::get('/clients/{id}', [ClientController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:client.view']);
Route::put('/clients/{id}', [ClientController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:client.update']);
Route::delete('/clients/{id}', [ClientController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:client.delete']);

// VENTES
Route::get('/ventes', [VenteController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:vente.view']);
Route::post('/ventes', [VenteController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:vente.create']);
Route::get('/ventes/{id}', [VenteController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:vente.view']);
Route::put('/ventes/{id}', [VenteController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:vente.update']);
Route::delete('/ventes/{id}', [VenteController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:vente.delete']);
Route::post('/ventes/{id}/confirmer', [VenteController::class, 'confirmer'])
    ->middleware(['auth:sanctum', 'permission:vente.confirm']);
Route::post('/ventes/{id}/annuler', [VenteController::class, 'annuler'])
    ->middleware(['auth:sanctum', 'permission:vente.cancel']);
Route::get('/ventes/{id}/impression', [VenteController::class, 'impression'])
    ->middleware(['auth:sanctum', 'permission:vente.print']);


// LIGNES DE VENTE
Route::get('/ventes/{venteId}/lignes', [VenteLigneController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:vente.view']);
Route::post('/ventes/{venteId}/lignes', [VenteLigneController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:vente.create']);
Route::get('/vente-lignes/{id}', [VenteLigneController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:vente.view']);
Route::delete('/vente-lignes/{id}', [VenteLigneController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:vente.cancel']);

// FACTURES
Route::get('/factures', [FactureController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:facture.view']);
Route::get('/factures/{id}', [FactureController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:facture.view']);
Route::post('/factures', [FactureController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:facture.create']);
Route::put('/factures/{id}', [FactureController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:facture.update']);
Route::delete('/factures/{id}', [FactureController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:facture.delete']);

// REGLEMENTS
Route::get('/reglements', [ReglementController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:reglement.view']);
Route::get('/reglements/{id}', [ReglementController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:reglement.view']);
Route::post('/reglements', [ReglementController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:reglement.create']);
Route::put('/reglements/{id}', [ReglementController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:reglement.update']);
Route::delete('/reglements/{id}', [ReglementController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:reglement.delete']);

// CAISSES
Route::get('/caisses', [CaisseController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:caisse.view']);
Route::get('/caisses/{id}', [CaisseController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:caisse.view']);
Route::post('/caisses', [CaisseController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:caisse.create']);
Route::put('/caisses/{id}', [CaisseController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:caisse.update']);
Route::delete('/caisses/{id}', [CaisseController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:caisse.delete']);
Route::post('/caisses/{id}/fermer', [CaisseController::class, 'fermer'])
    ->middleware(['auth:sanctum', 'permission:caisse.close']);
Route::get('/caisses/{id}/impression', [CaisseController::class, 'impression'])
    ->middleware(['auth:sanctum', 'permission:caisse.print']);

// MOUVEMENTS DE CAISSE
Route::get('/mouvements-caisse', [MouvementCaisseController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:caisse.view']);
Route::get('/mouvements-caisse/{id}', [MouvementCaisseController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:caisse.view']);
Route::get('/caisses/{caisseId}/mouvements', [MouvementCaisseController::class, 'parCaisse'])
    ->middleware(['auth:sanctum', 'permission:caisse.view']);
Route::post('/mouvements-caisse', [MouvementCaisseController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:caisse.create']);

// RAPPORTS
Route::get('/rapports', [RapportController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:rapport.view']);
Route::get('/rapports/{id}', [RapportController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:rapport.view']);
Route::post('/rapports', [RapportController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:rapport.create']);
Route::put('/rapports/{id}', [RapportController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:rapport.update']);
Route::delete('/rapports/{id}', [RapportController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:rapport.delete']);
Route::get('/rapports/{id}/impression', [RapportController::class, 'impression'])
    ->middleware(['auth:sanctum', 'permission:rapport.print']);

// UTILISATEURS
Route::get('/utilisateurs', [UtilisateurController::class, 'index'])
    ->middleware(['auth:sanctum', 'permission:user.view']);
Route::get('/utilisateurs/{id}', [UtilisateurController::class, 'show'])
    ->middleware(['auth:sanctum', 'permission:user.view']);
Route::post('/utilisateurs', [UtilisateurController::class, 'store'])
    ->middleware(['auth:sanctum', 'permission:user.create']);
Route::put('/utilisateurs/{id}', [UtilisateurController::class, 'update'])
    ->middleware(['auth:sanctum', 'permission:user.update']);
Route::delete('/utilisateurs/{id}', [UtilisateurController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'permission:user.delete']);

// USER PERMISSIONS
Route::get(
    '/utilisateurs/{userId}/permissions',
    [UserPermissionController::class, 'index']
)->middleware([
    'auth:sanctum',
    'permission:permission.manage'
]);
Route::put(
    '/utilisateurs/{userId}/permissions',
    [UserPermissionController::class, 'definir']
)->middleware([
    'auth:sanctum',
    'permission:permission.manage'
]);
Route::delete(
    '/utilisateurs/{userId}/permissions/{permissionId}',
    [UserPermissionController::class, 'supprimer']
)->middleware([
    'auth:sanctum',
    'permission:permission.manage'
]);

// ROLES
Route::get('/roles', [RoleController::class, 'index'])
    ->middleware([
        'auth:sanctum',
        'permission:role.view'
    ]);
Route::get(
    '/roles/{roleId}/permissions',
    [RoleController::class, 'permissions']
)->middleware([
    'auth:sanctum',
    'permission:role.view'
]);
Route::put(
    '/roles/{roleId}/permissions',
    [RoleController::class, 'definirPermission']
)->middleware([
    'auth:sanctum',
    'permission:role.update'
]);
Route::delete(
    '/roles/{roleId}/permissions/{permissionId}',
    [RoleController::class, 'supprimerPermission']
)->middleware([
    'auth:sanctum',
    'permission:role.update'
]);
Route::post(
    '/roles',
    [RoleController::class, 'store']
)->middleware([
    'auth:sanctum',
    'permission:role.create'
]);
Route::put(
    '/roles/{roleId}',
    [RoleController::class, 'update']
)->middleware([
    'auth:sanctum',
    'permission:role.update'
]);
Route::delete(
    '/roles/{roleId}',
    [RoleController::class, 'destroy']
)->middleware([
    'auth:sanctum',
    'permission:role.delete'
]);

// PERMISSIONS
Route::get(
    '/permissions',
    [PermissionController::class, 'index']
)->middleware([
    'auth:sanctum',
    'permission:permission.view'
]);
Route::post(
    '/permissions',
    [PermissionController::class, 'store']
)->middleware([
    'auth:sanctum',
    'permission:permission.create'
]);
Route::put(
    '/permissions/{id}',
    [PermissionController::class, 'update']
)->middleware([
    'auth:sanctum',
    'permission:permission.update'
]);
Route::delete(
    '/permissions/{id}',
    [PermissionController::class, 'destroy']
)->middleware([
    'auth:sanctum',
    'permission:permission.delete'
]);

// PERSONNELS
Route::get('/personnels', [PersonnelController::class, 'index'])
    ->middleware([
        'auth:sanctum',
        'permission:personnel.view'
    ]);
Route::get('/personnels/{id}', [PersonnelController::class, 'show'])
    ->middleware([
        'auth:sanctum',
        'permission:personnel.view'
    ]);
Route::post('/personnels', [PersonnelController::class, 'store'])
    ->middleware([
        'auth:sanctum',
        'permission:personnel.create'
    ]);
Route::put('/personnels/{id}', [PersonnelController::class, 'update'])
    ->middleware([
        'auth:sanctum',
        'permission:personnel.update'
    ]);
Route::delete('/personnels/{id}', [PersonnelController::class, 'destroy'])
    ->middleware([
        'auth:sanctum',
        'permission:personnel.delete'
    ]);

// ALERTES
Route::get('/alertes', [AlerteController::class, 'toutes'])
    ->middleware([
        'auth:sanctum',
        'permission:alerte.view'
    ]);

Route::get('/alertes/stocks-faibles', [AlerteController::class, 'stockFaible'])
    ->middleware([
        'auth:sanctum',
        'permission:alerte.view'
    ]);

Route::get('/alertes/ruptures', [AlerteController::class, 'ruptures'])
    ->middleware([
        'auth:sanctum',
        'permission:alerte.view'
    ]);

Route::get('/alertes/peremptions', [AlerteController::class, 'peremptions'])
    ->middleware([
        'auth:sanctum',
        'permission:alerte.view'
    ]);


// DASHBOARD
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware([
        'auth:sanctum',
        'permission:dashboard.view'
    ]);


// STATISTIQUES
Route::get('/statistiques/ventes', [StatistiquesController::class, 'ventes'])
    ->middleware([
        'auth:sanctum',
        'permission:statistique.view'
    ]);

Route::get('/statistiques/produits-plus-vendus', [
    StatistiquesController::class,
    'produitsPlusVendus'
])->middleware([
    'auth:sanctum',
    'permission:statistique.view'
]);

Route::get('/statistiques/chiffre-affaires', [
    StatistiquesController::class,
    'chiffreAffaires'
])->middleware([
    'auth:sanctum',
    'permission:statistique.view'
]);

Route::get('/statistiques/impression', [StatistiquesController::class, 'impression'])
    ->middleware(['auth:sanctum', 'permission:statistique.print']);
Route::get('/statistiques/export', [StatistiquesController::class, 'export'])
    ->middleware(['auth:sanctum', 'permission:statistique.export']);


// FACTURE — IMPRESSION
Route::get('/factures/{id}/impression', [
    ImpressionFactureController::class,
    'afficher'
])->middleware([
    'auth:sanctum',
    'permission:facture.print'
]);


// SAUVEGARDES
Route::get('/sauvegardes', [
    SauvegardeController::class,
    'index'
])->middleware([
    'auth:sanctum',
    'permission:sauvegarde.view'
]);

Route::post('/sauvegardes', [
    SauvegardeController::class,
    'store'
])->middleware([
    'auth:sanctum',
    'permission:sauvegarde.create'
]);

Route::put('/sauvegardes/{id}', [
    SauvegardeController::class,
    'update'
])->middleware([
    'auth:sanctum',
    'permission:sauvegarde.update'
]);

Route::delete('/sauvegardes/{id}', [
    SauvegardeController::class,
    'destroy'
])->middleware([
    'auth:sanctum',
    'permission:sauvegarde.delete'
]);

Route::post('/sauvegardes/restaurer', [
    SauvegardeController::class,
    'restaurer'
])->middleware([
    'auth:sanctum',
    'permission:sauvegarde.restore'
]);

Route::post('/sauvegardes/importer', [
    SauvegardeController::class,
    'importer'
])->middleware([
    'auth:sanctum',
    'permission:sauvegarde.import'
]);