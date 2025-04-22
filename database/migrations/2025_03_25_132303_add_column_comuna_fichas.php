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


            $table->unsignedBigInteger('comuna_id')->nullable();
            $table->foreign('comuna_id')->references('id')->on('comunas')->onDelete('set null');




        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fichas', function (Blueprint $table) {

            $table->dropForeign(['comuna_id']);
            $table->dropColumn(['comuna_id']);

            });
    }
};
