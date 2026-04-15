<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;


class AdminController extends Controller
{
    // GET /admins - List semua pengguna (beserta nama role-nya)
    public function index()
    {
        // Mengambil semua user beserta nama role mereka
        // Opsional: Kamu bisa memfilter agar 'customer' tidak ikut muncul di sini jika ini khusus staff
        $admins = User::with('roles:id,name')->get(['id', 'name', 'email', 'created_at']);

        // Rapikan format agar mudah dibaca Frontend
        $formattedAdmins = $admins->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                // Ambil role pertama (karena 1 user biasanya 1 role di sistem ini)
            ];
        });

        return response()->json($formattedAdmins);
    }

    // POST /admins - Buat pengguna baru dengan Role dinamis
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

        // 👈 Terapkan role sesuai pilihan dari Frontend
        $user->assignRole($request->role);

        return response()->json([
            'message' => 'Pengguna berhasil dibuat',
            'user'    => $user,
        ], 201);
    }

    // PUT /admins/{id} - Update pengguna & Role-nya
    public function update(Request $request, $id)
    {
        // Hilangkan batasan role('admin'), agar bisa mengedit role apa saja
        $user = User::findOrFail($id);

        // Jangan izinkan Super Admin diedit oleh orang lain
        if ($user->hasRole('super_admin') && auth()->id() !== $user->id) {
            return response()->json(['message' => 'Tidak dapat mengubah akun Super Admin'], 403);
        }

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

        // 👈 Jika frontend mengirimkan perubahan role, sinkronisasikan!
        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'message' => 'Pengguna berhasil diupdate',
            'user'    => $user,
        ]);
    }

    // DELETE /admins/{id} - Hapus pengguna
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Proteksi ekstra: Jangan sampai akun Super Admin terhapus!
        if ($user->hasRole('super_admin')) {
            return response()->json(['message' => 'Akun Super Admin tidak boleh dihapus!'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus',
        ]);
    }
}
