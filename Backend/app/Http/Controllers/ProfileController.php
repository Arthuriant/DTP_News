<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /**
     * Mengambil data profil user yang sedang login
     */
public function show()
    {
        // 1. Ambil user yang sedang login
        $user = Auth::user();

        // 2. Ambil data relasi profilnya
        $profile = $user->profile;

        // 3. Jika user belum punya data di tabel profiles sama sekali,
        // kita kembalikan struktur kosong agar Next.js tidak error (menampilkan tombol "Tambah")
        if (!$profile) {
            return response()->json([
                'date_of_birth' => null,
                'phone'         => null,
                'gender'        => null,
            ], 200);
        }

        // 4. Jika datanya ada, langsung kembalikan isi profil tersebut
        return response()->json($profile, 200);
    }

    /**
     * Memperbarui atau menyimpan data profil
     */
    public function update(Request $request)
    {

        $user = Auth::user();

        // Validasi data yang dikirim dari frontend/Postman
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'phone'         => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender'        => 'nullable|in:Laki-laki,Perempuan',
        ]);

        // Tambahkan validasi email
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id, // Pastikan email belum dipakai orang lain
            // ... validasi profile lainnya
        ]);

        // 1. Update field 'name' di tabel users
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email']
        ]);

        // 2. Update atau Buat (Create) data di tabel profiles
        // Laravel akan otomatis membuatkannya. Jika sudah ada, akan diupdate.
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id], // Kunci pencarian
            [
                'phone'         => $validated['phone'] ?? null,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender'        => $validated['gender'] ?? null,
            ] // Data yang diisi
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui!',
            'data' => $user->load('profile') // Mengembalikan data terbaru
        ]);
    }
}
