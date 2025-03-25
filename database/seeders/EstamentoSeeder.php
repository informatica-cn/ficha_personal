<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class EstamentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estamentos = [
            'Auxiliar',
            'Administrativo',
            'Técnico',
            'Jefatura',
            'Profesional',
            'Directivo'
        ];

        foreach ($estamentos as $nombre) {
            DB::table('estamentos')->insert([
                'nombre' => $nombre,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
