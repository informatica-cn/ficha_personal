<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ficha extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'fichas';

    protected $fillable = [
        'rut',
        'nombres',
        'direccion',
        'telefono',
        'correo',
        'urgencia',
        'direccion_municipal',
        'estamento_id',
        'grado_id',
        'comuna_id',
        'block',
        'declaracion'
    ];

    protected $dates = ['deleted_at'];
}