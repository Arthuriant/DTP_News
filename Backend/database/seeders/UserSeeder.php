<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat akun Admin Default
        $admin = User::firstOrCreate(
            ['email' => 'lintang@admin.com'], // Email default admin
            [
                'name' => 'Lintang Mahardika',
                'password' => Hash::make('admin'), // Password default
            ]
        );
        
        // Berikan pangkat admin ke akun ini
        $admin->assignRole('super_admin');

        // 1. Buat akun Admin Default
        $admin = User::firstOrCreate(
            ['email' => 'bayu@gmail.com'], // Email default admin
            [
                'name' => 'Bayu Putra',
                'password' => Hash::make('admin'), // Password default
            ]
        );
        
        // Berikan pangkat admin ke akun ini
        $admin->assignRole('admin');

        // 2. (Opsional) Buat satu akun Customer default untuk testing
        $customer = User::firstOrCreate(
            ['email' => 'customer@uptoyou.com'],
            [
                'name' => 'Customer Biasa',
                'password' => Hash::make('password123'),
            ]
        );
        $customer->assignRole('customer');
    }
}