<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        // 1. Validasi data masuk (Sekarang menerima harga dan json kustomisasi)
        $request->validate([
            'product_id' => 'required',
            'price' => 'required|numeric',
            'customizations' => 'nullable|array'
        ]);

        $user = Auth::user();

        // 2. Cari atau buat keranjang
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // 3. Cek apakah ada barang yang PERSIS SAMA (ID produk sama & kustomisasi sama persis)
        // Kita ambil semua barang dengan product_id yang sama dulu
        $existingItems = CartItem::where('cart_id', $cart->id)
                                 ->where('product_id', $request->product_id)
                                 ->get();

        // Cek manual apakah array kustomisasinya sama persis
        $foundItem = $existingItems->first(function($item) use ($request) {
            return $item->customizations == $request->customizations;
        });

        if ($foundItem) {
            // Jika user memesan tas dengan kustomisasi yang 100% sama, tambahkan jumlahnya saja
            $foundItem->quantity += 1;
            $foundItem->save();
        } else {
            // Jika kustomisasinya beda (misal beda warna pita), buat sebagai item baru di keranjang
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'price' => $request->price,
                'customizations' => $request->customizations,
                'image_preview' => $request->image_preview,
                'quantity' => 1
            ]);
        }

        return response()->json([
            'message' => 'Tas Kustom berhasil masuk keranjang!'
        ], 200);
    }

    public function getCart()
    {
        $user = Auth::user();
        if (!$user) return response()->json([], 401);

        // Cari ID keranjang milik user
        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) return response()->json([]);

        // Ambil semua isi keranjangnya
        $items = CartItem::where('cart_id', $cart->id)->get();
        
        return response()->json($items, 200);
    }
    public function removeItem($id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        // 1. Cari keranjang milik user ini dulu
        $cart = Cart::where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['message' => 'Keranjang tidak ditemukan'], 404);
        }

        // 2. Cari barang berdasarkan ID yang dikirim, dan pastikan itu ada di dalam keranjang user
        $item = CartItem::where('id', $id)
                        ->where('cart_id', $cart->id)
                        ->first();

        if ($item) {
            $item->delete(); // Hapus barangnya
            return response()->json(['message' => 'Barang berhasil dihapus'], 200);
        }

        return response()->json(['message' => 'Barang tidak ditemukan'], 404);
    }
}