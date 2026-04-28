<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{

    // Mengambil semua alamat milik user yang sedang login
    public function index()
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        // Ambil alamat, urutkan yang "Utama" (is_primary = true) di paling atas
        $addresses = Address::where('user_id', $user->id)
                            ->orderBy('is_primary', 'desc')
                            ->orderBy('created_at', 'desc')
                            ->get();

        return response()->json($addresses);
    }

    // Menyimpan alamat baru
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'region' => 'required|string|max:255',
            'street' => 'required|string',
            'details' => 'nullable|string',
            'label' => 'nullable|in:Rumah,Kantor',
            'is_primary' => 'boolean',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
        ]);

        $isPrimary = $request->is_primary;

        // Cek apakah ini alamat pertama? Jika ya, otomatis jadikan Utama
        $addressCount = Address::where('user_id', $user->id)->count();
        if ($addressCount === 0) {
            $isPrimary = true;
        }

        // Jika user mencentang "Jadikan Utama", kita harus mengubah alamat utama yang lama menjadi false
        if ($isPrimary) {
            Address::where('user_id', $user->id)->update(['is_primary' => false]);
        }

        $address = Address::create([
            'user_id' => $user->id,
            'recipient_name' => $request->recipient_name,
            'phone_number' => $request->phone_number,
            'region' => $request->region,
            'street' => $request->street,
            'details' => $request->details,
            'label' => $request->label,
            'is_primary' => $isPrimary,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json(['message' => 'Alamat berhasil ditambahkan', 'address' => $address], 201);
    }
    // Menghapus alamat
    public function destroy($id)
    {
        $user = Auth::user();
    if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);
    $address = Address::where('id', $id)->where('user_id', $user->id)->first();

    $user = Auth::user();
    $address = Address::findOrFail($id); // cari global, bukan per user


    if ($address) {
        $address->delete();
        return response()->json(['message' => 'Alamat berhasil dihapus'], 200);
    }
    return response()->json(['message' => 'Alamat tidak ditemukan'], 404);

    // bukan pemilik DAN bukan admin → tolak
    if ($address->user_id !== $user->id && !$user->can('delete_customers')) {
        return response()->json(['message' => 'Tidak memiliki akses'], 403);
    }

    $address->delete();
    return response()->json(['message' => 'Alamat berhasil dihapus'], 200);
    }

    // Mengubah alamat menjadi Utama
    public function setPrimary($id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $address = Address::where('id', $id)->where('user_id', $user->id)->first();

        if ($address) {
            // Ubah semua alamat user ini menjadi BUKAN utama
            Address::where('user_id', $user->id)->update(['is_primary' => false]);

            // Jadikan alamat yang dipilih menjadi Utama
            $address->update(['is_primary' => true]);

            return response()->json(['message' => 'Alamat utama berhasil diubah'], 200);
        }

        return response()->json(['message' => 'Alamat tidak ditemukan'], 404);
    }
    // Mengubah data alamat
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $address = Address::where('id', $id)->where('user_id', $user->id)->first();
        if (!$address) return response()->json(['message' => 'Alamat tidak ditemukan'], 404);


        $request->validate([
            'recipient_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'region' => 'required|string|max:255',
            'street' => 'required|string',
            'details' => 'nullable|string',
            'label' => 'nullable|in:Rumah,Kantor',
            'is_primary' => 'boolean',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
        ]);

        $isPrimary = $request->is_primary;

        // Jika user mencentang "Utama", matikan status utama di alamat lainnya
        if ($isPrimary && !$address->is_primary) {
            Address::where('user_id', $user->id)->update(['is_primary' => false]);
        }

        // Update datanya
        $address->update([
            'recipient_name' => $request->recipient_name,
            'phone_number' => $request->phone_number,
            'region' => $request->region,
            'street' => $request->street,
            'details' => $request->details,
            'label' => $request->label,
            'is_primary' => $isPrimary,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json(['message' => 'Alamat berhasil diubah', 'address' => $address], 200);
    }
}
