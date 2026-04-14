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

    public function store(Request $request)
{
    $validated = $request->validate([
        // Data User
        'name'          => 'required|string|max:255',
        'email'         => 'required|email|unique:users,email',
        'password'      => 'required|string|min:8|confirmed',

        // Data Profile
        'phone'         => 'nullable|string|max:20',
        'date_of_birth' => 'nullable|date',
        'gender'        => 'nullable|in:male,female,other',

        // Data Address (opsional)
        'addresses'                 => 'nullable|array',
        'addresses.*.recipient_name'=> 'required_with:addresses|string|max:255',
        'addresses.*.phone_number'  => 'required_with:addresses|string|max:20',
        'addresses.*.region'        => 'nullable|string|max:255',
        'addresses.*.street'        => 'nullable|string|max:255',
        'addresses.*.details'       => 'nullable|string',
        'addresses.*.label'         => 'nullable|string|max:100',
        'addresses.*.is_primary'    => 'nullable|boolean',
        'addresses.*.latitude'      => 'nullable|numeric',
        'addresses.*.longitude'     => 'nullable|numeric',
    ]);

    // 1. Buat User
    $user = User::create([
        'name'      => $validated['name'],
        'email'     => $validated['email'],
        'password'  => bcrypt($validated['password']),
        'is_active' => true,
    ]);

    // 2. Assign role customer
    $user->assignRole('customer');

    // 3. Buat Profile jika ada data profile
    if (!empty($validated['phone']) || !empty($validated['date_of_birth']) || !empty($validated['gender'])) {
        $user->profile()->create([
            'phone'         => $validated['phone'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'gender'        => $validated['gender'] ?? null,
        ]);
    }

    // 4. Buat Address jika ada
    if (!empty($validated['addresses'])) {
        // Pastikan hanya satu is_primary = true
        $hasPrimary = collect($validated['addresses'])->contains('is_primary', true);

        foreach ($validated['addresses'] as $index => $addressData) {
            $user->addresses()->create([
                'recipient_name' => $addressData['recipient_name'],
                'phone_number'   => $addressData['phone_number'],
                'region'         => $addressData['region'] ?? null,
                'street'         => $addressData['street'] ?? null,
                'details'        => $addressData['details'] ?? null,
                'label'          => $addressData['label'] ?? null,
                // Jika tidak ada yang is_primary, jadikan index 0 sebagai primary
                'is_primary'     => $hasPrimary ? ($addressData['is_primary'] ?? false) : ($index === 0),
                'latitude'       => $addressData['latitude'] ?? null,
                'longitude'      => $addressData['longitude'] ?? null,
            ]);
        }
    }

    // 5. Load relasi untuk response
    $user->load([
        'profile',
        'addresses' => fn($q) => $q->orderBy('is_primary', 'desc')
    ]);

    return response()->json([
        'message'  => 'Pelanggan berhasil dibuat',
        'customer' => [
            'id'            => $user->id,
            'name'          => $user->name,
            'email'         => $user->email,
            'created_at'    => $user->created_at,
            'phone'         => $user->profile?->phone,
            'date_of_birth' => $user->profile?->date_of_birth,
            'gender'        => $user->profile?->gender,
            'total_orders'  => 0,
            'is_active'     => $user->is_active,
            'is_online'     => false,
            'addresses'     => $user->addresses->map(fn($address) => [
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
            ]),
        ]
    ], 201);
}

public function update(Request $request, $id)
{
    $customer = User::role('customer')->findOrFail($id);

    $validated = $request->validate([
        // Data User
        'name'          => 'sometimes|string|max:255',
        'email'         => 'sometimes|email|unique:users,email,' . $id,
        'password'      => 'sometimes|nullable|string|min:8|confirmed',

        // Data Profile
        'phone'         => 'nullable|string|max:20',
        'date_of_birth' => 'nullable|date',
        'gender'        => 'nullable|in:male,female,other',

        // Data Address
        'addresses'                     => 'nullable|array',
        'addresses.*.id'                => 'nullable|integer|exists:addresses,id',
        'addresses.*.recipient_name'    => 'required_with:addresses|string|max:255',
        'addresses.*.phone_number'      => 'required_with:addresses|string|max:20',
        'addresses.*.region'            => 'nullable|string|max:255',
        'addresses.*.street'            => 'nullable|string|max:255',
        'addresses.*.details'           => 'nullable|string',
        'addresses.*.label'             => 'nullable|string|max:100',
        'addresses.*.is_primary'        => 'nullable|boolean',
        'addresses.*.latitude'          => 'nullable|numeric',
        'addresses.*.longitude'         => 'nullable|numeric',
    ]);

    // 1. Update User
    $userPayload = array_filter([
        'name'  => $validated['name'] ?? null,
        'email' => $validated['email'] ?? null,
    ]);

    if (!empty($validated['password'])) {
        $userPayload['password'] = bcrypt($validated['password']);
    }

    if (!empty($userPayload)) {
        $customer->update($userPayload);
    }

    // 2. Update atau buat Profile
    $profilePayload = array_filter([
        'phone'         => $validated['phone'] ?? null,
        'date_of_birth' => $validated['date_of_birth'] ?? null,
        'gender'        => $validated['gender'] ?? null,
    ]);

    if (!empty($profilePayload)) {
        $customer->profile()->updateOrCreate(
            ['user_id' => $customer->id],
            $profilePayload
        );
    }

    // 3. Sync Addresses
    if (isset($validated['addresses'])) {
        $incomingIds = collect($validated['addresses'])->pluck('id')->filter()->toArray();

        // Hapus address yang tidak ada di request
        $customer->addresses()->whereNotIn('id', $incomingIds)->delete();

        $hasPrimary = collect($validated['addresses'])->contains('is_primary', true);

        foreach ($validated['addresses'] as $index => $addressData) {
            $payload = [
                'recipient_name' => $addressData['recipient_name'],
                'phone_number'   => $addressData['phone_number'],
                'region'         => $addressData['region'] ?? null,
                'street'         => $addressData['street'] ?? null,
                'details'        => $addressData['details'] ?? null,
                'label'          => $addressData['label'] ?? null,
                'is_primary'     => $hasPrimary ? ($addressData['is_primary'] ?? false) : ($index === 0),
                'latitude'       => $addressData['latitude'] ?? null,
                'longitude'      => $addressData['longitude'] ?? null,
            ];

            if (!empty($addressData['id'])) {
                // Update address yang sudah ada
                $customer->addresses()->where('id', $addressData['id'])->update($payload);
            } else {
                // Buat address baru
                $customer->addresses()->create($payload);
            }
        }
    }

    // 4. Load relasi untuk response
    $customer->load([
        'profile',
        'addresses' => fn($q) => $q->orderBy('is_primary', 'desc')
    ]);

    return response()->json([
        'message'  => 'Pelanggan berhasil diperbarui',
        'customer' => [
            'id'            => $customer->id,
            'name'          => $customer->name,
            'email'         => $customer->email,
            'created_at'    => $customer->created_at,
            'phone'         => $customer->profile?->phone,
            'date_of_birth' => $customer->profile?->date_of_birth,
            'gender'        => $customer->profile?->gender,
            'total_orders'  => rand(0, 10),
            'is_active'     => $customer->is_active,
            'is_online'     => Cache::has('user-is-online-' . $customer->id),
            'addresses'     => $customer->addresses->map(fn($address) => [
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
            ]),
        ]
    ]);
}
public function destroy($id)
{
    $customer = User::role('customer')->findOrFail($id);

    // 1. Hapus semua address milik customer
    $customer->addresses()->delete();

    // 2. Hapus profile milik customer
    $customer->profile()->delete();

    // 3. Hapus role customer
    $customer->removeRole('customer');

    // 4. Hapus user
    $customer->delete();

    return response()->json([
        'message' => 'Pelanggan berhasil dihapus',
    ]);
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
