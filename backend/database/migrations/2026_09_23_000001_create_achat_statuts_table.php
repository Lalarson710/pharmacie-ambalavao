<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('achat_statuts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('achat_id')->constrained('achats')->onDelete('cascade');
            $table->string('statut_precedent')->nullable();
            $table->string('nouveau_statut');
            $table->text('commentaire')->nullable();
            $table->foreignId('utilisateur_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('achat_statuts', function (Blueprint $table) {
            $table->drop();
        });
    }
};
