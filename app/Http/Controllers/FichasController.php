<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ficha;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Validator;
class FichasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        /*     if ($request->ajax()) {
                return DataTables::of(Ficha::query())->make(true);
            }

            return response()->json(['message' => 'Método no permitido'], 405); */
            $fichas = Ficha::select(
                'fichas.id',
                'fichas.nombres',
                'fichas.direccion',
                'fichas.comuna',
                'fichas.telefono',
                'fichas.correo',
                'fichas.urgencia',
                'fichas.direccion_municipal',
                'grados.nombre as grado',      // Obtener el nombre del grado
                'grados.id as grado_id',
                'estamentos.nombre as estamento', // Obtener el nombre del estamento
                'estamentos.id as estamento_id'
            )
            ->leftJoin('grados', 'grados.id', '=', 'fichas.grado_id') // Unir con la tabla grados
            ->leftJoin('estamentos', 'estamentos.id', '=', 'fichas.estamento_id') // Unir con la tabla estamentos
            ->get();

            return response()->json($fichas);
        }


    public function store(Request $request)
    {
            // Validar los datos del formulario
            $messages = [
                'nombres.required' => 'El nombre es obligatorio.',
                'nombres.string' => 'El nombre debe ser un texto.',
                'direccion.required' => 'La dirección es obligatoria.',
                'telefono.required' => 'El teléfono es obligatorio.',
                'telefono.max' => 'El teléfono no debe superar los 20 caracteres.',
                'correo.required' => 'El correo electrónico es obligatorio.',
                'correo.email' => 'El correo electrónico debe tener un formato válido.',
                'correo.unique' => 'El correo electrónico ya está registrado en el sistema.',
               /*  'urgencia.required' => 'El campo urgencia es obligatorio.', */
            ];

            // Validar los datos del formulario con los mensajes personalizados
            $validator = Validator::make($request->all(), [
                'nombres' => 'required|string|max:255',
                'direccion' => 'required|string|max:255',
                'telefono' => 'required|string|max:20',
                'correo' => 'required|email|max:255|unique:fichas,correo',
               /*  'urgencia' => 'required|string|max:255', */
            ], $messages);


    // Si hay errores, devolver un JSON con los mensajes de error y status 422
    if ($validator->fails()) {
        return response()->json([
            'message' => 'Error de validación',
            'errors' => $validator->errors()
        ], 422);
    }

        // Crear una nueva ficha
        $ficha = Ficha::create([
            'nombres' => $request->nombres,
            'direccion' => $request->direccion,
            'comuna'=>$request->comuna,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'urgencia' => $request->urgencia,
            'estamento_id'=>$request->estamento_id,
            'grado_id'=>$request->grado_id,
            'direccion_municipal'=>$request->direccion_municipal
        ]);


        return DataTables::of(Ficha::query())->make(true);
      /*   return response()->json([
            'message' => 'Ficha creada exitosamente',
            'ficha' => $ficha,
            'data' =>  $data
        ], 201); */
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'correo' => 'required|email|max:255',
            'urgencia' => 'nullable|string|max:255',
        ]);

        // Si la validación falla, devolver errores
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Buscar la ficha a actualizar
            $ficha = Ficha::findOrFail($id);

            // Actualizar los datos
            $ficha->update([
                'nombres' => $request->nombres,
                'direccion' => $request->direccion,
                'comuna'=>$request->comuna,
                'telefono' => $request->telefono,
                'correo' => $request->correo,
                'urgencia' => $request->urgencia,
                'direccion_municipal' => $request->direccion_municipal,
                'grado_id' => $request->grado_id,
                'estamento_id' => $request->estamento_id,
            ]);
            $fichaActualizada = Ficha::select(
                'fichas.id',
                'fichas.nombres',
                'fichas.direccion',
                'fichas.comuna',
                'fichas.telefono',
                'fichas.correo',
                'fichas.urgencia',
                'fichas.direccion_municipal',
                'grados.nombre as grado',      // Obtener el nombre del grado
                'grados.id as grado_id',
                'estamentos.nombre as estamento', // Obtener el nombre del estamento
                'estamentos.id as estamento_id'
            )
            ->leftJoin('grados', 'grados.id', '=', 'fichas.grado_id')
            ->leftJoin('estamentos', 'estamentos.id', '=', 'fichas.estamento_id')
            ->where('fichas.id', $id)
            ->first(); // Obtener solo la ficha actualizada

            // Retornar la ficha actualizada
            return response()->json([
                'message' => 'Ficha actualizada correctamente',
                'ficha' => $fichaActualizada
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la ficha',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Buscar el registro con el id proporcionado
            $ficha = Ficha::findOrFail($id);

            // Eliminar el registro de la base de datos
            $ficha->delete();

            // Devolver el id del registro eliminado como parte de la respuesta
            return response()->json(['id' => $id, 'message' => 'Ficha eliminada correctamente.'], 200);
        } catch (\Exception $e) {
            // En caso de error, devolver una respuesta con error
            return response()->json(['error' => 'No se pudo eliminar la ficha.'], 500);
        }
    }
}