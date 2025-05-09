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
        Schema::create('fichas', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('direccion')->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo')->unique();
            $table->string('urgencia')->nullable();
            $table->softDeletes(); // Agrega soporte para eliminación suave
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fichas');
    }
};
