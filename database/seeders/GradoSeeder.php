<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class GradoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 18; $i++) {
            DB::table('grados')->insert([
                'nombre' => (string) $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
