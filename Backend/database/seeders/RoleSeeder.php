<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Bersihkan cache Spatie (Wajib agar tidak error saat reset database)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. BUAT SEMUA HAK AKSES (PERMISSIONS)
        $permissions = [
            'view_products', 'create_products', 'edit_products', 'delete_products',
            'view_orders', 'update_orders', 'delete_orders',
            'view_customers', 'edit_customers', 'delete_customers',
            'manage_roles', 'view_dashboard'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. BUAT PANGKAT (ROLES) & PASANGKAN HAK AKSESNYA
        
        // Pangkat Tertinggi: Super Admin
        // (Tidak perlu dipasangkan permission, karena dia punya Kunci Master di AppServiceProvider)
        Role::firstOrCreate(['name' => 'super_admin']);

        // Pangkat Kedua: Admin Biasa
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions); // Admin biasa diberi semua akses secara eksplisit

        // Pangkat Ketiga: Customer
        Role::firstOrCreate(['name' => 'customer']);
        
        // Pangkat Keempat: Kasir (Contoh tambahan)
        $kasirRole = Role::firstOrCreate(['name' => 'kasir']);
        $kasirRole->syncPermissions(['view_products', 'view_orders', 'update_orders', 'view_dashboard']);
    }
}
