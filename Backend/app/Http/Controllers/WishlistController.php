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
        $wishlists = Wishlist::with([
            'product',
            'product.parts.variants.textures',
            'product.sizes',
        ])
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $wishlists->map(function ($item) {
                return [
                    'id'             => $item->id,
                    'product_id'     => $item->product_id,
                    'customizations' => $item->customizations,
                    'total_price'    => $item->total_price,
                    'product'        => [
                        'id'         => $item->product->id,
                        'name'       => $item->product->name,
                        'base_price' => $item->product->base_price,
                        'img'        => $item->product->img, 
                        
                        'parts'      => $item->product->parts->map(function ($part) {
                            return [
                                'id'       => $part->id,
                                'name'     => $part->name,
                                'z_index'  => $part->z_index,
                                'variants' => $part->variants->map(function ($variant) {
                                    return [
                                        'id'       => $variant->id,
                                        'textures' => $variant->textures->map(function ($texture) {
                                            return [
                                                'id'             => $texture->id,
       
                                                'img_front'      => $texture->img_front,
                                                'img_back'       => $texture->img_back,
                                                'img_top'        => $texture->img_top,
                                                'img_front_mask' => $texture->img_front_mask,
                                                'img_back_mask'  => $texture->img_back_mask,
                                                'img_top_mask'   => $texture->img_top_mask,
                                            ];
                                        }),
                                    ];
                                }),
                            ];
                        }),
                        'sizes' => $item->product->sizes->map(function ($size) {
                            return [
                                'id'    => $size->id,
                                'title' => $size->title,
                            ];
                        }),
                    ],
                ];
            }),
        ], 200);
    }

    // 2. POST /wishlist - Tambah produk ke wishlist
        public function store(Request $request)
    {
        $request->validate([
            'product_id'     => 'required|exists:products,id',
            'customizations' => 'nullable|array', // ← tambah ini
            'total_price'    => 'nullable|numeric', // ← tambah ini
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
            'user_id'        => Auth::id(),
            'product_id'     => $request->product_id,
            'customizations' => $request->customizations, // ← tambah ini
            'total_price'    => $request->total_price, // ← tambah ini
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan ke wishlist',
            'data'    => $wishlist,
        ], 201);
    }

    public function update(Request $request, $productId)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->first();

        if (!$wishlist) {
            return response()->json(['message' => 'Wishlist tidak ditemukan'], 404);
        }

        $wishlist->update([
            'customizations' => $request->customizations,
            'total_price'    => $request->total_price,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wishlist berhasil diupdate',
            'data'    => $wishlist,
        ]);
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
