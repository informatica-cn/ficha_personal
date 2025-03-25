<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FichasController;
use App\Http\Controllers\ComunaController;
use Illuminate\Support\Facades\Http;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('ficha')->group(function () {
    Route::post('', [FichasController::class, 'store']);
   /*  Route::get('/all', [FichasController::class, 'index']); */
    Route::get('', [FichasController::class, 'index'])->name('fichas.index');
    Route::delete('{id}', [FichasController::class, 'destroy'])->name('fichas.destroy');
    Route::put('{id}', [FichasController::class, 'update'])->name('fichas.update');
});
/* Route::get('/comunas', function () {
    $response = Http::get('https://apis.digital.gob.cl/dpa/comunas');
    return $response->json();
}); */

Route::get('/comunas', [ComunaController::class, 'index']);