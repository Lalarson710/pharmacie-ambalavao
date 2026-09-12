<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caisses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->dateTime('date_ouverture');

            $table->decimal('montant_initial', 12, 2)
                ->default(0);

            $table->dateTime('date_fermeture')
                ->nullable();

            $table->decimal('montant_final', 12, 2)
                ->nullable();

            $table->decimal('ecart', 12, 2)
                ->nullable();

            $table->string('statut', 30)
                ->default('ouverte');

            $table->text('observation')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caisses');
    }
};