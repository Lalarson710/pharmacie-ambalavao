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
        Schema::create('produit_conditionnements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('produit_id')
                ->constrained('produits')
                ->restrictOnDelete();

            $table->foreignId('unite_id')
                ->constrained('unites')
                ->restrictOnDelete();

            $table->integer('quantite_base')->default(1);

            $table->decimal('prix_vente', 12, 2)->default(0);

            $table->string('code_barres', 50)->nullable();

            $table->boolean('est_unite_base')->default(false);

            $table->boolean('actif')->default(true);

            $table->timestamps();

            // Un produit ne peut pas avoir deux conditionnements avec la même unité
            $table->unique(['produit_id', 'unite_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produit_conditionnements');
    }
};
