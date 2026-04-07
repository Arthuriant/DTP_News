<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    // 1. Mengambil semua Role beserta jumlah user dan daftar hak aksesnya
    public function index()
    {
        // Ambil role, hitung usernya, dan ambil nama-nama permissionnya
        $roles = Role::with('permissions')->withCount('users')->get();
        
        $formattedRoles = $roles->map(function($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'users_count' => $role->users_count,
                // Format ulang permission agar berbentuk array string (contoh: ['view_products', 'edit_products'])
                'permissions' => $role->permissions->pluck('name')
            ];
        });

        return response()->json($formattedRoles);
    }

    // 2. Menyimpan Role Baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => strtolower($request->name)]);
        
        // Pasangkan hak akses ke role ini
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json(['message' => 'Role berhasil dibuat']);
    }

    // 3. Mengubah Role dan Hak Aksesnya
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        // Jangan izinkan nama super_admin dan admin diubah
        if (!in_array($role->name, ['super_admin', 'admin'])) {
            $request->validate(['name' => 'required|string|unique:roles,name,'.$id]);
            $role->name = strtolower($request->name);
            $role->save();
        }

        // Update hak aksesnya
        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return response()->json(['message' => 'Role berhasil diupdate']);
    }

    // 4. Menghapus Role
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if (in_array($role->name, ['super_admin', 'admin'])) {
            return response()->json(['message' => 'Role sistem inti tidak boleh dihapus!'], 403);
        }

        $role->delete();
        return response()->json(['message' => 'Role berhasil dihapus']);
    }
}