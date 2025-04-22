<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Region extends Model
{
    use HasFactory;

    // Definir el nombre de la tabla si no sigue la convención
    protected $table = 'regiones';

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombre',
        'roman_number',
        'number',

    ];

    // Si no deseas que Laravel gestione las columnas created_at y updated_at, desactívalas
    public $timestamps = true;
}
