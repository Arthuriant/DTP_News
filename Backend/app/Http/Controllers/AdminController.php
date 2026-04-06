<?php

namespace App\Http\Controllers;

use App\Models\User; // ← ini yang kurang
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    // GET /admins - List semua admin
    public function index()
    {
        $admins = User::role('admin')->get(['id', 'name', 'email', 'created_at']);

        return response()->json($admins);
    }

    // POST /admins - Buat admin baru
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('admin');

        return response()->json([
            'message' => 'Admin berhasil dibuat',
            'admin'   => $user,
        ], 201);
    }

    // PUT /admins/{id} - Update admin
    public function update(Request $request, $id)
    {
        $user = User::role('admin')->findOrFail($id);

        $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
        ]);

        $user->update([
            'name'     => $request->name ?? $user->name,
            'email'    => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        return response()->json([
            'message' => 'Admin berhasil diupdate',
            'admin'   => $user,
        ]);
    }

    // DELETE /admins/{id} - Hapus admin
    public function destroy($id)
    {
        $user = User::role('admin')->findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'Admin berhasil dihapus',
        ]);
    }
}
