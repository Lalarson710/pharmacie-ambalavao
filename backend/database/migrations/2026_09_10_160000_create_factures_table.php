<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vente_id')
                ->unique()
                ->constrained('ventes')
                ->restrictOnDelete();

            $table->string('numero', 50)->unique();

            $table->date('date_facture');

            $table->decimal('montant_total', 12, 2);

            $table->string('statut', 30)
                ->default('impayee');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};