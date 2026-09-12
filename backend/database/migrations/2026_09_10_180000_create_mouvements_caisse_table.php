<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mouvements_caisse', function (Blueprint $table) {
            $table->id();

            $table->foreignId('caisse_id')
                ->constrained('caisses')
                ->restrictOnDelete();

            $table->foreignId('reglement_id')
                ->nullable()
                ->constrained('reglements')
                ->restrictOnDelete();

            $table->string('type', 30);

            $table->decimal('montant', 12, 2);

            $table->text('motif')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mouvements_caisse');
    }
};