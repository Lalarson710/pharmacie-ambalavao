<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('fournisseur_id')
                ->constrained('fournisseurs')
                ->restrictOnDelete();

            $table->string('numero', 50)->unique();
            $table->date('date_achat');
            $table->decimal('montant_total', 12, 2)->default(0);
            $table->string('statut', 30)->default('brouillon');
            $table->text('observation')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achats');
    }
};