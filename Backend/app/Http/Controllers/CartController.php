<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // ========================================================
    // 1. ADD TO CART
    // ========================================================
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'price' => 'required|numeric',
            'custom_configuration' => 'nullable|array',
            'image_preview' => 'nullable|string'
        ]);

        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $imagePath = null;
        if ($request->filled('image_preview')) {
            $imageParts = explode(";base64,", $request->image_preview);
            if (count($imageParts) == 2) {
                $imageBase64 = base64_decode($imageParts[1]);
                $fileName = uniqid('cart_') . '.png';

                \Illuminate\Support\Facades\Storage::disk('public')->put('carts/' . $fileName, $imageBase64);
                $imagePath = asset('storage/carts/' . $fileName);
            }
        }

        $existingItems = CartItem::where('cart_id', $cart->id)
                                 ->where('product_id', $request->product_id)
                                 ->get();

        $foundItem = $existingItems->first(function($item) use ($request) {
            return $item->custom_configuration == $request->custom_configuration;
        });

        // 👇 PERUBAHAN DIMULAI DARI SINI 👇
        $savedItem = null; // Buat variabel penampung

        if ($foundItem) {
            $foundItem->qty += 1;
            $foundItem->save();
            $savedItem = $foundItem; // Masukkan ke penampung
        } else {
            $savedItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'price' => $request->price,
                'custom_configuration' => $request->custom_configuration,
                'image_preview' => $imagePath,
                'qty' => 1
            ]); // Masukkan hasil create ke penampung
        }

        $this->updateCartTotal($cart->id);

        // 👇 KEMBALIKAN DATA BARANGNYA KE NEXT.JS 👇
        return response()->json([
            'message' => 'Tas Kustom berhasil masuk keranjang!',
            'cart_item' => $savedItem
        ], 200);
    }
    // ========================================================
    // 2. GET CART (LIHAT KERANJANG)
    // ========================================================
    public function getCart()
    {
        $user = auth('sanctum')->user();

        if (!$user) {
            return response()->json([
                'total' => 0,
                'items' => []
            ], 200);
        }

        $cart = Cart::with(['items.product'])->where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'total' => 0,
                'items' => []
            ], 200);
        }

        return response()->json([
            'id' => $cart->id,
            'total' => $cart->total,
            'items' => $cart->items
        ], 200);
    }

    // ========================================================
    // 3. REMOVE ITEM (HAPUS BARANG)
    // ========================================================
    public function removeItem($id)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $cart = Cart::where('user_id', $user->id)->first();
        if (!$cart) return response()->json(['message' => 'Keranjang tidak ditemukan'], 404);

        $item = CartItem::where('id', $id)
                        ->where('cart_id', $cart->id)
                        ->first();

        if ($item) {
            $item->delete();
            $this->updateCartTotal($cart->id); // Update total setelah dihapus
            return response()->json(['message' => 'Barang berhasil dihapus'], 200);
        }

        return response()->json(['message' => 'Barang tidak ditemukan'], 404);
    }

    // ========================================================
    // Fungsi Bantuan Internal untuk Menghitung Total Keranjang
    // ========================================================
    private function updateCartTotal($cartId)
    {
        $total = CartItem::where('cart_id', $cartId)
                         ->selectRaw('SUM(price * qty) as total')
                         ->value('total');

        Cart::where('id', $cartId)->update(['total' => $total ?? 0]);
    }

    // ========================================================
    // 4. UPDATE QUANTITY (UBAH JUMLAH)
    // ========================================================
    public function updateQuantity(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) return response()->json(['message' => 'Keranjang tidak ditemukan'], 404);

        $item = CartItem::where('id', $id)
                        ->where('cart_id', $cart->id)
                        ->first();

        if ($item) {
            $item->qty = $request->qty;
            $item->save();

            // Hitung ulang total keranjang
            $this->updateCartTotal($cart->id);

            return response()->json(['message' => 'Kuantiti berhasil diperbarui'], 200);
        }

        return response()->json(['message' => 'Barang tidak ditemukan'], 404);
    }
}
