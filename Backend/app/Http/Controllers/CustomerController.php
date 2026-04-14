<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CustomerController extends Controller
{
    // GET /customers
    public function index()
    {
        // 1. Ambil user dengan role customer, gabungkan relasi profile dan addresses (dengan urutan is_primary)
        $customers = User::role('customer')
            ->with([
                'profile', 
                'addresses' => function ($query) {
                    $query->orderBy('is_primary', 'desc');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Format data gabungan
        $formattedCustomers = $customers->map(function ($user) {
            return [
                // Data dasar
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'created_at'    => $user->created_at,
                
                // Data dari relasi Profile (Kode Temanmu)
                'phone'         => $user->profile?->phone,
                'date_of_birth' => $user->profile?->date_of_birth,
                'gender'        => $user->profile?->gender,

                // Data Status & Logika (Kode Kamu)
                'total_orders'  => rand(0, 10), // Simulasi total pesanan
                'is_active'     => $user->is_active ?? true, 
                'is_online'     => Cache::has('user-is-online-' . $user->id),

                // Data dari relasi Address yang di-mapping rapi (Gabungan)
                'addresses'     => $user->addresses->map(function ($address) {
                    return [
                        'id'             => $address->id,
                        'recipient_name' => $address->recipient_name,
                        'phone_number'   => $address->phone_number,
                        'region'         => $address->region,
                        'street'         => $address->street,
                        'details'        => $address->details,
                        'label'          => $address->label,
                        'is_primary'     => $address->is_primary,
                        'latitude'       => $address->latitude,
                        'longitude'      => $address->longitude,
                    ];
                }),
            ];
        });

        return response()->json($formattedCustomers);
    }

    // PUT /customers/{id}/toggle-status
    // Fitur ekstra untuk tombol "Suspend / Aktifkan" di tabel (Kode Kamu dipertahankan)
    public function toggleStatus($id)
    {
        $customer = User::role('customer')->findOrFail($id);
        
        // Membalikkan status (true jadi false, false jadi true)
        $customer->update([
            'is_active' => !$customer->is_active
        ]);

        return response()->json([
            'message' => 'Status pelanggan berhasil diubah',
            'is_active' => $customer->is_active
        ]);
    }
}