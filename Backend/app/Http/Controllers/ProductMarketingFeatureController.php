<?php

namespace App\Http\Controllers;

use App\Models\ProductMarketingFeatures;
use Illuminate\Http\Request;

class ProductMarketingFeatureController extends Controller
{
    // 1. GET /product-marketing-features/{block_id} - Mengambil fitur berdasarkan Block
    public function index($blockId)
    {
        $features = ProductMarketingFeatures::where('block_id', $blockId)
                        ->orderBy('created_at', 'asc')
                        ->get();

        return response()->json($features);
    }

    // 2. POST /product-marketing-features - Menambah fitur baru ke dalam Block
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'block_id'   => 'required|exists:product_marketing_blocks,id',
            'title'      => 'required|string|max:25', // Batasan ketat sesuai database
        ]);

        $feature = ProductMarketingFeatures::create([
            'product_id' => $request->product_id,
            'block_id'   => $request->block_id,
            'title'      => $request->title,
        ]);

        return response()->json([
            'message' => 'Fitur berhasil ditambahkan ke dalam blok',
            'data'    => $feature
        ], 201);
    }

    // 3. PUT /product-marketing-features/{id} - Mengubah teks fitur
    public function update(Request $request, $id)
    {
        $feature = ProductMarketingFeatures::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:25',
        ]);

        // Kita hanya mengizinkan update 'title', product_id dan block_id tidak boleh pindah
        $feature->update([
            'title' => $request->title,
        ]);

        return response()->json([
            'message' => 'Fitur berhasil diperbarui',
            'data'    => $feature
        ]);
    }

    // 4. DELETE /product-marketing-features/{id} - Menghapus fitur
    public function destroy($id)
    {
        $feature = ProductMarketingFeatures::findOrFail($id);
        
        $feature->delete();

        return response()->json(['message' => 'Fitur berhasil dihapus']);
    }
}