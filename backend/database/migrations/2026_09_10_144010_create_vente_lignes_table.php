<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vente_lignes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vente_id')
                ->constrained('ventes')
                ->cascadeOnDelete();

            $table->foreignId('produit_id')
                ->constrained('produits')
                ->restrictOnDelete();

            $table->foreignId('lot_id')
                ->constrained('lots')
                ->restrictOnDelete();

            $table->integer('quantite');

            $table->decimal('prix_unitaire', 12, 2);

            $table->decimal('montant', 12, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vente_lignes');
    }
};