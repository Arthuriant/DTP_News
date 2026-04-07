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
        $superadmin = User::firstOrCreate(
            ['email' => 'lintang@admin.com'], // Email default admin
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin'), // Password default
            ]
        );

        // Berikan pangkat admin ke akun ini
        $superadmin->assignRole('super_admin');

         // 2. Admin biasa ← tambah ini
            $admin = User::firstOrCreate(
                ['email' => 'admin@uptoyou.com'],
                [
                    'name' => 'Admin',
                    'password' => Hash::make('admin123'),
                ]
            );
            $admin->assignRole('admin');

        // 3. (Opsional) Buat satu akun Customer default untuk testing
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
