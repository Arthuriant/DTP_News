<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan cache Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. BUAT SEMUA HAK AKSES (Cocokkan dengan Frontend Roles.tsx)
        $permissions = [
            'view_dashboard',
            'view_products', 'create_products', 'edit_products', 'delete_products',
            'view_orders', 'update_orders', 'delete_orders',
            'view_customers', 'edit_customers', 'delete_customers',
            'view_users', 'create_users', 'edit_users', 'delete_users', // 👈 INI YANG TADI HILANG
            'view_roles', 'create_roles', 'edit_roles', 'delete_roles'  // 👈 INI JUGA DITAMBAHKAN
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. BUAT PANGKAT (ROLES)
        Role::firstOrCreate(['name' => 'super_admin']);

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions); // Admin diberi semua akses

        Role::firstOrCreate(['name' => 'customer']);
        
        $kasirRole = Role::firstOrCreate(['name' => 'kasir']);
        $kasirRole->syncPermissions(['view_products', 'view_orders', 'update_orders', 'view_dashboard']);
    }
}