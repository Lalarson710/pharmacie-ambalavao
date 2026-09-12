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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();

            $table->foreignId('categorie_id')
                ->constrained('categories')
                ->restrictOnDelete();

            $table->foreignId('unite_id')
                ->constrained('unites')
                ->restrictOnDelete();

            $table->string('nom', 150);
            $table->string('code_barres', 50)->nullable()->unique();
            $table->text('description')->nullable();

            $table->decimal('prix_achat', 12, 2);
            $table->decimal('prix_vente', 12, 2);
            $table->integer('stock_minimum')->default(0);

            $table->boolean('actif')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
