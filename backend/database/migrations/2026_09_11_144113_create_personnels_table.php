<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personnels', function (Blueprint $table) {
            $table->id();

            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('telephone', 30)->nullable();
            $table->string('email', 150)->nullable()->unique();
            $table->text('adresse')->nullable();

            $table->string('fonction', 100);
            $table->date('date_embauche')->nullable();

            $table->boolean('actif')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personnels');
    }
};