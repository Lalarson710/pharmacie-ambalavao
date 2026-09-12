<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reglements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('facture_id')
                ->constrained('factures')
                ->restrictOnDelete();

            $table->decimal('montant', 12, 2);

            $table->string('mode', 30);

            $table->dateTime('date_reglement');

            $table->text('reference')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reglements');
    }
};