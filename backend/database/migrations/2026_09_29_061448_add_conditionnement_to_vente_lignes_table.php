<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vente_lignes', function (Blueprint $table) {
            $table->foreignId('conditionnement_id')
                ->nullable()
                ->constrained('produit_conditionnements')
                ->nullOnDelete()
                ->after('produit_id');

            $table->integer('quantite_conditionnement')
                ->nullable()
                ->after('quantite');

            $table->integer('quantite_base')
                ->nullable()
                ->after('quantite_conditionnement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vente_lignes', function (Blueprint $table) {
            $table->dropForeign(['conditionnement_id']);
            $table->dropColumn(['conditionnement_id', 'quantite_conditionnement', 'quantite_base']);
        });
    }
};
