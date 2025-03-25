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
        Schema::table('fichas', function (Blueprint $table) {

            $table->string('direccion_municipal')->nullable();
            $table->unsignedBigInteger('grado_id')->nullable();
            $table->unsignedBigInteger('estamento_id')->nullable();

            $table->foreign('grado_id')->references('id')->on('grados')->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('estamento_id')->references('id')->on('estamentos')->nullOnDelete()->cascadeOnUpdate();



        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fichas', function (Blueprint $table) {

            $table->dropColumn('direccion_municipal');
            $table->dropColumn('grado_id');
            });
    }
};
