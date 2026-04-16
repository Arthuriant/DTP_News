<?php

namespace App\Http\Controllers;

use App\Models\ProductMarketingBlocks;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductMarketingBlockController extends Controller
{
    // 1. GET /product-marketing-blocks/{product_id} - Menampilkan semua blok untuk 1 produk
    public function index($productId)
    {
        // Sekalian kita panggil relasi 'features' jika nanti Anda sudah membuatnya
        $blocks = ProductMarketingBlocks::where('product_id', $productId)
                    ->with('features') 
                    ->orderBy('created_at', 'asc')
                    ->get();

        return response()->json($blocks);
    }

    // 2. POST /product-marketing-blocks - Membuat blok marketing baru
    public function store(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'title'       => 'required|string|max:25',
            'subtitle'    => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'img'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $blockId = (string) Str::uuid();
        $imgPath = null;

        // Jika ada gambar, simpan ke folder Marketing
        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $folderPath = "products/{$request->product_id}/Marketing";
            $filename = "{$blockId}." . $file->getClientOriginalExtension();
            
            $file->storeAs($folderPath, $filename, 'public');
            $imgPath = "{$folderPath}/{$filename}";
        }

        $block = ProductMarketingBlocks::create([
            'id'          => $blockId,
            'product_id'  => $request->product_id,
            'title'       => $request->title,
            'subtitle'    => $request->subtitle,
            'description' => $request->description,
            'img'         => $imgPath,
        ]);

        return response()->json([
            'message' => 'Marketing block berhasil ditambahkan',
            'data'    => $block
        ], 201);
    }

    // 3. PUT /product-marketing-blocks/{id} - Mengubah blok marketing
    public function update(Request $request, $id)
    {
        $block = ProductMarketingBlocks::findOrFail($id);

        $request->validate([
            'title'       => 'sometimes|required|string|max:25',
            'subtitle'    => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'img'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $dataToUpdate = $request->only(['title', 'subtitle', 'description']);

        // Jika mengupload gambar baru
        if ($request->hasFile('img')) {
            // Hapus gambar lama jika ada
            if ($block->img && Storage::disk('public')->exists($block->img)) {
                Storage::disk('public')->delete($block->img);
            }

            // Simpan gambar baru
            $file = $request->file('img');
            $folderPath = "products/{$block->product_id}/Marketing";
            $filename = "{$block->id}." . $file->getClientOriginalExtension();
            
            $file->storeAs($folderPath, $filename, 'public');
            $dataToUpdate['img'] = "{$folderPath}/{$filename}";
        }

        $block->update($dataToUpdate);

        return response()->json([
            'message' => 'Marketing block berhasil diperbarui',
            'data'    => $block
        ]);
    }

    // 4. DELETE /product-marketing-blocks/{id} - Menghapus blok beserta gambarnya
    public function destroy($id)
    {
        $block = ProductMarketingBlocks::findOrFail($id);

        // Hapus fisik gambar
        if ($block->img && Storage::disk('public')->exists($block->img)) {
            Storage::disk('public')->delete($block->img);
        }

        $block->delete();

        return response()->json(['message' => 'Marketing block berhasil dihapus']);
    }
}