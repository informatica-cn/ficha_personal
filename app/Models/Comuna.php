<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Comuna extends Model
{
    use HasFactory;

    // Definir el nombre de la tabla si no sigue la convención
    protected $table = 'comunas';

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'codigo',
        'tipo',
        'nombre',
        'lat',
        'lng',
        'url',
        'codigo_padre',
    ];

    // Si no deseas que Laravel gestione las columnas created_at y updated_at, desactívalas
    public $timestamps = true;

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}
