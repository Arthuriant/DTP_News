<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan cache Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. BUAT SEMUA HAK AKSES UNTUK SANCTUM
        $permissions = [
            'view_dashboard',
            'view_products', 'create_products', 'edit_products', 'delete_products',
            'view_orders', 'update_orders', 'delete_orders',
            'view_customers', 'edit_customers', 'delete_customers',
            'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_roles', 'create_roles', 'edit_roles', 'delete_roles' 
        ];

        foreach ($permissions as $permission) {
            // 👇 Tambahkan guard_name di sini
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // 2. BUAT PANGKAT (ROLES) UNTUK SANCTUM
        // 👇 Tambahkan guard_name di masing-masing role
        Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'sanctum']);

        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum']);
        $adminRole->syncPermissions($permissions); // Admin diberi semua akses

        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'sanctum']);
        
        $kasirRole = Role::firstOrCreate(['name' => 'kasir', 'guard_name' => 'sanctum']);
        $kasirRole->syncPermissions(['view_products', 'view_orders', 'update_orders', 'view_dashboard']);
    }
}