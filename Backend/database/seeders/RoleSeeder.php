<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Membuat role Admin
        Role::firstOrCreate(['name' => 'admin']);
        
        // Membuat role Customer
        Role::firstOrCreate(['name' => 'customer']);
    }
}
