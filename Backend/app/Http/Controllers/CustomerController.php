<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CustomerController extends Controller
{
    // GET /customers
    public function index()
    {
        // 1. Ambil semua user yang memiliki role 'customer'
        // 2. Sertakan relasi 'addresses' (alamat mereka)
        // 3. Sertakan relasi 'orders' (jika kamu punya tabel pesanan, untuk menghitung total pesanan)
        $customers = User::role('customer')
            ->with(['addresses' => function ($query) {
                // Urutkan agar alamat utama (is_primary = 1) berada di urutan pertama
                $query->orderBy('is_primary', 'desc');
            }])
            // Opsional: Jika kamu punya tabel/relasi orders, gunakan withCount
            // ->withCount('orders') 
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'created_at', 'is_active']); // Ambil kolom yang diperlukan saja

        // 4. Format data agar sesuai dengan yang dibutuhkan Frontend (Customer.tsx)
        $formattedCustomers = $customers->map(function ($customer) {
            return [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'created_at' => $customer->created_at,
                // Simulasi total pesanan (ganti dengan $customer->orders_count jika relasi orders sudah ada)
                'total_orders' => rand(0, 10), 
                // Cek status aktif/suspend
                'is_active' => $customer->is_active ?? true, 
                // Status online (bisa didapat dari session/cache, untuk sekarang kita set true saja jika baru login)
                'is_online' => Cache::has('user-is-online-' . $customer->id),
                // Kirim data alamatnya
                'addresses' => $customer->addresses,
            ];
        });

        return response()->json($formattedCustomers);
    }

    // PUT /customers/{id}/toggle-status
    // Fitur ekstra untuk tombol "Suspend / Aktifkan" di tabel
    public function toggleStatus($id)
    {
        $customer = User::role('customer')->findOrFail($id);
        
        // Membalikkan status (true jadi false, false jadi true)
        // Pastikan kamu punya kolom 'is_active' (boolean) di tabel users
        $customer->update([
            'is_active' => !$customer->is_active
        ]);

        return response()->json([
            'message' => 'Status pelanggan berhasil diubah',
            'is_active' => $customer->is_active
        ]);
    }
}