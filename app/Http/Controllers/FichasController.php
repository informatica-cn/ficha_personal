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


            $fichas = Ficha::select(
                'fichas.id',
                'fichas.nombres',
                'fichas.direccion',
                'fichas.rut',
                'fichas.comuna_id',
                'fichas.region_id',
                'fichas.telefono',
                'fichas.correo',
                'fichas.block',
                'fichas.declaracion',
                'fichas.urgencia_nombre',
                'fichas.urgencia_telefono',
                'fichas.updated_at',
                'fichas.direccion_municipal',
                'comunas.nombre as comuna_nombre',
                'regiones.nombre as region_nombre',
                'grados.nombre as grado',
                'grados.id as grado_id',
                'estamentos.nombre as estamento',
                'estamentos.id as estamento_id'
            )
            ->leftJoin('grados', 'grados.id', '=', 'fichas.grado_id')
            ->leftJoin('estamentos', 'estamentos.id', '=', 'fichas.estamento_id')
            ->leftJoin('comunas', 'comunas.id', '=', 'fichas.comuna_id')
            ->leftJoin('regiones', 'regiones.id', '=', 'fichas.region_id')
            ->whereNotNull('fichas.updated_at')

            ->get();

            $result = $fichas->map(function ($ficha) {
                return [
                    'id' => $ficha->id,
                    'nombres' => $ficha->nombres,
                    'rut'=>$ficha->rut,
                    'direccion' => $ficha->direccion,
                    'comuna' => [
                        'value' => $ficha->comuna_id,
                        'label' => $ficha->comuna_nombre
                    ],
                    'region' => [
                        'value' => $ficha->region_id,
                        'label' => $ficha->region_nombre
                    ],
                    'telefono' => $ficha->telefono,
                    'correo' => $ficha->correo,
                    'block' => $ficha->block,
                    'declaracion' => $ficha->declaracion,
                    'urgencia_nombre' => $ficha->urgencia_nombre,
                    'urgencia_telefono' => $ficha->urgencia_telefono,
                    'direccion_municipal' => $ficha->direccion_municipal,
                    'fecha_actualizacion' => \Carbon\Carbon::parse($ficha->updated_at)->format('d-m-Y H:i'),
                    'grado' => $ficha->grado,
                    'grado_id' => $ficha->grado_id,
                    'estamento' => $ficha->estamento,
                    'estamento_id' => $ficha->estamento_id,
                ];
            });

            return response()->json($result);
        }


    public function store(Request $request)
    {
            // Validar los datos del formulario
            $messages = [
                'nombres.required' => 'El nombre es obligatorio.',
                'declaracion.required' => 'El campo declaracio es requerido.',
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
                'declaracion' => 'required',

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
            'urgencia_nombre' => $request->urgencia_nombre,
            'urgencia_telefono' => $request->urgencia_telefono,
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
    public function show($id)
    {


        //value label
        $fichas = Ficha::select(
            'fichas.id',
            'fichas.nombres',
            'fichas.direccion',
            'fichas.comuna_id',
            'fichas.telefono',
            'fichas.correo',
            'fichas.block',
            'fichas.declaracion',
            'fichas.urgencia_nombre',
            'fichas.urgencia_telefono',
            'fichas.region_id',
            'fichas.direccion_municipal',
            'comunas.nombre as comuna_nombre',
            'regiones.nombre as region_nombre',
            'grados.nombre as grado',      // Obtener el nombre del grado
            'grados.id as grado_id',
            'estamentos.nombre as estamento', // Obtener el nombre del estamento
            'estamentos.id as estamento_id'
        )
        ->leftJoin('grados', 'grados.id', '=', 'fichas.grado_id') // Unir con la tabla grados
        ->leftJoin('estamentos', 'estamentos.id', '=', 'fichas.estamento_id') // Unir con la tabla estamentos
        ->leftJoin('comunas', 'comunas.id', '=', 'fichas.comuna_id')
        ->leftJoin('regiones', 'regiones.id', '=', 'fichas.region_id')

        ->where('rut',str_replace('.', '',$id))
        ->get();

        if ($fichas->isEmpty()) {
            return response()->json(['message' => 'No se encontró ningún registro con el RUT proporcionado.'], 404);
        }

        $result = $fichas->map(function ($ficha) {
            return [
                'id' => $ficha->id,
                'rut'=>$ficha->rut,
                'nombres' => $ficha->nombres,
                'direccion' => $ficha->direccion,
                'declaracion'=>$ficha->declaracion,
                'comuna' => [
                    'value' => $ficha->comuna_id,   // ID de la comuna
                    'label' => $ficha->comuna_nombre // Nombre de la comuna
                ],
                'region' => [
                    'value' => $ficha->region_id,   // ID de la comuna
                    'label' => $ficha->region_nombre // Nombre de la comuna
                ],
                'telefono' => $ficha->telefono,
                'correo' => $ficha->correo,
                'block' => $ficha->block,
                'urgencia_nombre' => $ficha->urgencia_nombre,
                'urgencia_telefono' => $ficha->urgencia_telefono,
                'direccion_municipal' => $ficha->direccion_municipal,
                'grado' => $ficha->grado,
                'grado_id' => $ficha->grado_id,
                'estamento' => $ficha->estamento,
                'estamento_id' => $ficha->estamento_id,
            ];
        });

        return response()->json($result);

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
    public function update(Request $request)
    {


        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string|max:255',
            'rut' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
            'correo' => 'required|email|max:255',
            'urgencia_nombre' => 'required|string|max:255',
            'urgencia_telefono' => 'required|string|max:255',
            'declaracion' => 'required|string|max:255',

        ], [
            'nombres.required' => 'El campo nombres es obligatorio.',
            'nombres.string' => 'El campo nombres debe ser una cadena de texto.',
            'nombres.max' => 'El campo nombres no puede tener más de 255 caracteres.',

            'rut.required' => 'El campo RUT es obligatorio.',
            'rut.string' => 'El campo RUT debe ser una cadena de texto.',
            'rut.max' => 'El campo RUT no puede tener más de 255 caracteres.',

            'direccion.required' => 'El campo dirección es obligatorio.',
            'direccion.string' => 'El campo dirección debe ser una cadena de texto.',
            'direccion.max' => 'El campo dirección no puede tener más de 255 caracteres.',

            'telefono.required' => 'El campo teléfono es obligatorio.',
            'telefono.string' => 'El campo teléfono debe ser una cadena de texto.',
            'telefono.max' => 'El campo teléfono no puede tener más de 20 caracteres.',

            'correo.required' => 'El campo correo es obligatorio.',
            'correo.email' => 'El campo correo debe ser una dirección de correo válida.',
            'correo.max' => 'El campo correo no puede tener más de 255 caracteres.',

            'urgencia_nombre.required' => 'El campo  nombre es obligatorio.',
            'urgencia_nombre.string' => 'El campo urgencia nombre debe ser una cadena de texto.',
            'urgencia_nombre.max' => 'El campo urgencia nombre no puede tener más de 255 caracteres.',

            'urgencia_telefono.required' => 'El campo telefono  es obligatorio.',
            'urgencia_telefono.string' => 'El campo urgencia telefono debe ser una cadena de texto.',
            'urgencia_telefono.max' => 'El campo urgencia telefono no puede tener más de 255 caracteres.',

            'declaracion.required' => 'El campo declaracion es obligatorio.',
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
            $ficha = Ficha::where('rut',str_replace('.', '',$request->rut))->first();

            if (!$ficha) {
                return response()->json([
                    'message' => 'Ficha no encontrada',
                ], 404);
            }



            // Actualizar los datos
            // Actualizar los datos
       $ficha->nombres = $request->nombres;
        $ficha->direccion = $request->direccion;
          $ficha->comuna_id = $request->comuna_id['value'];
       $ficha->block = $request->block;
         $ficha->region_id = $request->region_id['value'];
        $ficha->telefono = $request->telefono;
        $ficha->correo = $request->correo;
        $ficha->urgencia_nombre = $request->urgencia_nombre;
        $ficha->urgencia_telefono = $request->urgencia_telefono;
        $ficha->direccion_municipal = $request->direccion_municipal;
        $ficha->grado_id = $request->grado_id;
        $ficha->estamento_id = $request->estamento_id;
        $ficha->declaracion = $request->declaracion;

        // Guardar la ficha actualizada
        $ficha->save();
         /*    $fichaActualizada = Ficha::select(
                'fichas.id',
                'fichas.nombres',
                'fichas.direccion',
                'fichas.comuna_id',
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
            ->where('fichas.rut',str_replace('.', '',$request->rut))
            ->first(); // Obtener solo la ficha actualizada
 */

 $fichas = Ficha::select(
    'fichas.id',
    'fichas.nombres',
    'fichas.direccion',
    'fichas.comuna_id',
    'fichas.telefono',
    'fichas.correo',
    'fichas.block',
    'fichas.declaracion',
    'fichas.urgencia_nombre',
    'fichas.urgencia_telefono',
    'fichas.region_id',
    'fichas.direccion_municipal',
    'comunas.nombre as comuna_nombre',
    'regiones.nombre as region_nombre',
    'grados.nombre as grado',      // Obtener el nombre del grado
    'grados.id as grado_id',
    'estamentos.nombre as estamento', // Obtener el nombre del estamento
    'estamentos.id as estamento_id'
)
->leftJoin('grados', 'grados.id', '=', 'fichas.grado_id') // Unir con la tabla grados
->leftJoin('estamentos', 'estamentos.id', '=', 'fichas.estamento_id') // Unir con la tabla estamentos
->leftJoin('comunas', 'comunas.id', '=', 'fichas.comuna_id')
->leftJoin('regiones', 'regiones.id', '=', 'fichas.region_id')

->where('rut',str_replace('.', '',str_replace('.', '',$request->rut)))
->get();

if ($fichas->isEmpty()) {
    return response()->json(['message' => 'No se encontró ningún registro con el RUT proporcionado.'], 404);
}

$fichaActualizada = $fichas->map(function ($ficha) {
    return [
        'id' => $ficha->id,
        'rut'=>$ficha->rut,
        'nombres' => $ficha->nombres,
        'direccion' => $ficha->direccion,
        'declaracion'=>$ficha->declaracion,
        'comuna' => [
            'value' => $ficha->comuna_id,   // ID de la comuna
            'label' => $ficha->comuna_nombre // Nombre de la comuna
        ],
        'region' => [
            'value' => $ficha->region_id,   // ID de la comuna
            'label' => $ficha->region_nombre // Nombre de la comuna
        ],
        'telefono' => $ficha->telefono,
        'correo' => $ficha->correo,
        'block' => $ficha->block,
        'urgencia_nombre' => $ficha->urgencia_nombre,
        'urgencia_telefono' => $ficha->urgencia_telefono,
        'direccion_municipal' => $ficha->direccion_municipal,
        'grado' => $ficha->grado,
        'grado_id' => $ficha->grado_id,
        'estamento' => $ficha->estamento,
        'estamento_id' => $ficha->estamento_id,
    ];
});

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