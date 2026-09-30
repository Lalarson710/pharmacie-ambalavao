<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Pour chaque produit existant, créer un conditionnement par défaut
        // qui correspond à son unité actuelle avec quantite_base = 1
        $produits = DB::table('produits')
            ->where('actif', true)
            ->get(['id', 'unite_id', 'prix_vente', 'code_barres']);

        foreach ($produits as $produit) {
            // Vérifier si un conditionnement existe déjà pour ce produit et cette unité
            $existe = DB::table('produit_conditionnements')
                ->where('produit_id', $produit->id)
                ->where('unite_id', $produit->unite_id)
                ->exists();

            if (!$existe) {
                DB::table('produit_conditionnements')->insert([
                    'produit_id' => $produit->id,
                    'unite_id' => $produit->unite_id,
                    'quantite_base' => 1,
                    'prix_vente' => $produit->prix_vente,
                    'code_barres' => $produit->code_barres,
                    'est_unite_base' => true,
                    'actif' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Supprimer les conditionnements créés par cette migration
        // (ceux qui ont est_unite_base = true et quantite_base = 1)
        DB::table('produit_conditionnements')
            ->where('est_unite_base', true)
            ->where('quantite_base', 1)
            ->delete();
    }
};
