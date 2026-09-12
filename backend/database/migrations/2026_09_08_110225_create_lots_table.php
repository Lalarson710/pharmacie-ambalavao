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
        Schema::create('lots', function (Blueprint $table) {
            $table->id();

            $table->foreignId('produit_id')
                ->constrained('produits')
                ->restrictOnDelete();

            $table->string('numero_lot', 100);

            $table->date('date_peremption');

            $table->integer('quantite')->default(0);

            $table->timestamps();

            $table->unique(['produit_id', 'numero_lot']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lots');
    }
};
