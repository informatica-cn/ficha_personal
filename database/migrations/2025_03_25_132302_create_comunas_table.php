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
        Schema::create('comunas', function (Blueprint $table) {
            $table->id();  // Agrega una columna 'id' autoincremental
            $table->string('codigo');  // Columna 'codigo' (por ejemplo, 05602)
            $table->string('tipo');  // Columna 'tipo' (por ejemplo, comuna)
            $table->string('nombre');  // Columna 'nombre' (por ejemplo, Algarrobo)
            $table->decimal('lat', 10, 7);  // Columna 'lat' para latitud (máximo 10 dígitos, 7 decimales)
            $table->decimal('lng', 10, 7);  // Columna 'lng' para longitud (máximo 10 dígitos, 7 decimales)
            $table->string('url')->nullable();  // Columna 'url' (puede ser nula)
            $table->string('codigo_padre');  // Columna 'codigo_padre' (por ejemplo, 056)
            $table->timestamps();  // Agrega las columnas 'created_at' y 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comunas');
    }
};
