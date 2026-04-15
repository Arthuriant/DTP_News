<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    // GET /products - List semua produk
    public function index()
    {
        $products = Product::with('subCategory')
            ->latest()
            ->get();

        return response()->json($products);
    }

    // GET /products/{id} - Detail produk
    public function show($id)
    {
        $product = Product::with('subCategory')->findOrFail($id);

        return response()->json($product);
    }

    // POST /products - Buat produk baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sub_categories_id' => 'required|exists:sub_categories,id',
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'summary'           => 'nullable|string',
            'base_price'        => 'required|numeric|min:0',
            'is_active'         => 'boolean',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produk berhasil dibuat',
            'product' => $product->load('subCategory'),
        ], 201);
    }

    // PUT /products/{id} - Update produk
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'sub_categories_id' => 'sometimes|exists:sub_categories,id',
            'name'              => 'sometimes|string|max:255',
            'description'       => 'nullable|string',
            'summary'           => 'nullable|string',
            'base_price'        => 'sometimes|numeric|min:0',
            'is_active'         => 'boolean',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diupdate',
            'product' => $product->load('subCategory'),
        ]);
    }

    // DELETE /products/{id} - Hapus produk
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }

    // PATCH /products/{id}/toggle - Toggle aktif/nonaktif
    public function toggle($id)
    {
        $product = Product::findOrFail($id);
        $product->update(['is_active' => !$product->is_active]);

        return response()->json([
            'message' => 'Status produk berhasil diubah',
            'is_active' => $product->is_active,
        ]);
    }
}
