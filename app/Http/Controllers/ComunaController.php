<?php

namespace App\Http\Controllers;

use App\Models\Comuna;
use Illuminate\Http\Request;

class ComunaController extends Controller
{
     /**
     * Obtener todas las comunas.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Obtener todas las comunas
        $comunas = Comuna::with('region')->get();

        // Retornar las comunas en formato JSON
        return response()->json($comunas);
    }
}
