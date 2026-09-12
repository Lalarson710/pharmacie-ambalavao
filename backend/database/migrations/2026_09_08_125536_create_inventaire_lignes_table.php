<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventaires_lignes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('inventaire_id')
                ->constrained('inventaires')
                ->cascadeOnDelete();

            $table->foreignId('lot_id')
                ->constrained('lots')
                ->restrictOnDelete();

            $table->integer('quantite_theorique');

            $table->integer('quantite_reelle');

            $table->integer('ecart');

            $table->timestamps();

            $table->unique(['inventaire_id', 'lot_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventaires_lignes');
    }
};