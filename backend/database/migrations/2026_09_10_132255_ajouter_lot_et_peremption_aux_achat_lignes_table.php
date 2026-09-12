<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('achat_lignes', function (Blueprint $table) {
            $table->string('numero_lot', 100)->nullable()->after('produit_id');
            $table->date('date_peremption')->nullable()->after('numero_lot');
        });
    }

    public function down(): void
    {
        Schema::table('achat_lignes', function (Blueprint $table) {
            $table->dropColumn([
                'numero_lot',
                'date_peremption',
            ]);
        });
    }
};