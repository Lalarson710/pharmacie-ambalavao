<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Application\Auth\Ports\UserRepositoryInterface::class,
            \App\Infrastructure\Auth\UserRepository::class
        );

        $this->app->bind(
            \App\Application\Auth\Ports\TokenServiceInterface::class,
            \App\Infrastructure\Auth\SanctumTokenService::class
        );

        $this->app->bind(
            \App\Application\Auth\Ports\LogoutServiceInterface::class,
            \App\Infrastructure\Auth\SanctumLogoutService::class
        );

        $this->app->bind(
            \App\Application\Categorie\Ports\CategorieRepositoryInterface::class,
            \App\Infrastructure\Categorie\CategorieRepository::class
        );

        $this->app->bind(
            \App\Application\Unite\Ports\UniteRepositoryInterface::class,
            \App\Infrastructure\Unite\UniteRepository::class
        );

        $this->app->bind(
            \App\Application\Produit\Ports\ProduitRepositoryInterface::class,
            \App\Infrastructure\Produit\ProduitRepository::class
        );

        $this->app->bind(
            \App\Application\Lot\Ports\LotRepositoryInterface::class,
            \App\Infrastructure\Lot\LotRepository::class
        );

        $this->app->bind(
            \App\Application\MouvementStock\Ports\MouvementStockRepositoryInterface::class,
            \App\Infrastructure\MouvementStock\MouvementStockRepository::class
        );

        $this->app->bind(
            \App\Application\Stock\Ports\StockRepositoryInterface::class,
            \App\Infrastructure\Stock\StockRepository::class
        );

        $this->app->bind(
            \App\Application\Inventaire\Ports\InventaireRepositoryInterface::class,
            \App\Infrastructure\Inventaire\InventaireRepository::class
        );

        $this->app->bind(
            \App\Application\Achat\Ports\FournisseurRepositoryInterface::class,
            \App\Infrastructure\Achat\FournisseurRepository::class
        );

        $this->app->bind(
            \App\Application\Achat\Ports\AchatRepositoryInterface::class,
            \App\Infrastructure\Achat\AchatRepository::class
        );

        $this->app->bind(
            \App\Application\Achat\Ports\AchatLigneRepositoryInterface::class,
            \App\Infrastructure\Achat\AchatLigneRepository::class
        );

        $this->app->bind(
            \App\Application\Client\Ports\ClientRepositoryInterface::class,
            \App\Infrastructure\Client\ClientRepository::class
        );

        $this->app->bind(
            \App\Application\Vente\Ports\VenteRepositoryInterface::class,
            \App\Infrastructure\Vente\VenteRepository::class
        );

        $this->app->bind(
            \App\Application\Vente\Ports\VenteLigneRepositoryInterface::class,
            \App\Infrastructure\Vente\VenteLigneRepository::class
        );

        $this->app->bind(
            \App\Application\Facture\Ports\FactureRepositoryInterface::class,
            \App\Infrastructure\Facture\FactureRepository::class
        );

        $this->app->bind(
            \App\Application\Reglement\Ports\ReglementRepositoryInterface::class,
            \App\Infrastructure\Reglement\ReglementRepository::class
        );

        $this->app->bind(
            \App\Application\Caisse\Ports\CaisseRepositoryInterface::class,
            \App\Infrastructure\Caisse\CaisseRepository::class
        );

        $this->app->bind(
            \App\Application\Caisse\Ports\MouvementCaisseRepositoryInterface::class,
            \App\Infrastructure\Caisse\MouvementCaisseRepository::class
        );

        $this->app->bind(
            \App\Application\Rapport\Ports\RapportRepositoryInterface::class,
            \App\Infrastructure\Rapport\RapportRepository::class
        );

        $this->app->bind(
            \App\Application\Personnel\Ports\UserRepositoryInterface::class,
            \App\Infrastructure\Personnel\UserRepository::class
        );

        $this->app->bind(
            \App\Application\Personnel\Ports\UserPermissionRepositoryInterface::class,
            \App\Infrastructure\Personnel\UserPermissionRepository::class
        );

        $this->app->bind(
            \App\Application\Personnel\Ports\RoleRepositoryInterface::class,
            \App\Infrastructure\Personnel\RoleRepository::class
        );

        $this->app->bind(
            \App\Application\Personnel\Ports\RolePermissionRepositoryInterface::class,
            \App\Infrastructure\Personnel\RolePermissionRepository::class
        );

        $this->app->bind(
            \App\Application\Personnel\Ports\PermissionRepositoryInterface::class,
            \App\Infrastructure\Personnel\PermissionRepository::class
        );

        $this->app->bind(
            \App\Application\Personnel\Ports\PersonnelRepositoryInterface::class,
            \App\Infrastructure\Personnel\PersonnelRepository::class
        );

        $this->app->bind(
            \App\Application\Alertes\Ports\AlerteRepositoryInterface::class,
            \App\Infrastructure\Alertes\AlerteRepository::class
        );

        $this->app->bind(
            \App\Application\Dashboard\Ports\DashboardRepositoryInterface::class,
            \App\Infrastructure\Dashboard\DashboardRepository::class
        );

        $this->app->bind(
            \App\Application\Sauvegarde\Ports\SauvegardeRepositoryInterface::class,
            \App\Infrastructure\Sauvegarde\SauvegardeRepository::class
        );

        $this->app->bind(
            \App\Application\Statistiques\Ports\StatistiquesRepositoryInterface::class,
            \App\Infrastructure\Statistiques\StatistiquesRepository::class
        );

        $this->app->bind(
            \App\Application\Facture\Ports\ImpressionFactureRepositoryInterface::class,
            \App\Infrastructure\Facture\ImpressionFactureRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
