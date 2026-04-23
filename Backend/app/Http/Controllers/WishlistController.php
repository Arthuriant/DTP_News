<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;  // ← ini yang kurang
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
     public function index()
    {
        $wishlists = Wishlist::with('product')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $wishlists->map(function ($item) {
                return [
                    'id'         => $item->id,
                    'product_id' => $item->product_id,
                    'product'    => [
                        'id'         => $item->product->id,
                        'name'       => $item->product->name,
                        'base_price' => $item->product->base_price,
                        'img'        => $item->product->img
                                        ? "http://127.0.0.1:8000/storage/{$item->product->img}"
                                        : null,
                    ],
                ];
            }),
        ], 200);
    }

    // 2. POST /wishlist - Tambah produk ke wishlist
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // Cek apakah produk sudah ada di wishlist
        $exists = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Produk sudah ada di wishlist',
            ], 409);
        }

        $wishlist = Wishlist::create([
            'user_id'    => Auth::id(),
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan ke wishlist',
            'data'    => $wishlist,
        ], 201);
    }

    // 3. DELETE /wishlist/{product_id} - Hapus dari wishlist
    public function destroy($productId)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan di wishlist',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus dari wishlist',
        ], 200);
    }

    // 4. GET /wishlist/check/{product_id} - Cek apakah produk ada di wishlist
    public function check($productId)
    {
        $exists = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'is_wishlisted' => $exists,
        ], 200);
    }
}
