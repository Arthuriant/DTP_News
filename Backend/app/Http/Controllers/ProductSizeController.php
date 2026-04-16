<?php

namespace App\Http\Controllers;

use App\Models\ProductSizes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductSizeController extends Controller
{
    // 1. GET /product-sizes/{product_id} - Mengambil semua daftar ukuran untuk 1 produk
    public function index($productId)
    {
        // Kita urutkan berdasarkan ukuran lebar (width) dari terkecil ke terbesar (S -> XL)
        $sizes = ProductSizes::where('product_id', $productId)
                    ->orderBy('width', 'asc')
                    ->get();

        return response()->json($sizes);
    }

    // 2. POST /product-sizes - Membuat varian ukuran baru (Create)
    public function store(Request $request)
    {
        $request->validate([
            'product_id'  => 'required|exists:products,id',
            'title'       => 'required|string|max:25',
            'short_desc'  => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'width'       => 'nullable|integer',
            'height'      => 'nullable|integer',
            'depth'       => 'nullable|integer',
            'unit'        => 'nullable|string|max:10',
            'img'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $sizeId = (string) Str::uuid();
        $imgPath = null;

        // Jika Admin mengunggah gambar tas untuk ukuran ini
        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $folderPath = "products/{$request->product_id}/Size";
            $filename = "{$sizeId}." . $file->getClientOriginalExtension();
            
            $file->storeAs($folderPath, $filename, 'public');
            $imgPath = "{$folderPath}/{$filename}";
        }

        $size = ProductSizes::create([
            'id'          => $sizeId,
            'product_id'  => $request->product_id,
            'title'       => $request->title,
            'short_desc'  => $request->short_desc,
            'description' => $request->description,
            'price'       => $request->price ?? 0,
            'width'       => $request->width,
            'height'      => $request->height,
            'depth'       => $request->depth,
            'unit'        => $request->unit ?? 'cm', // Default ke 'cm' jika kosong
            'img'         => $imgPath,
        ]);

        return response()->json([
            'message' => 'Varian ukuran berhasil ditambahkan',
            'data'    => $size
        ], 201);
    }

    // 3. PUT /product-sizes/{id} - Mengubah data ukuran (Update)
    public function update(Request $request, $id)
    {
        $size = ProductSizes::findOrFail($id);

        $request->validate([
            'title'       => 'sometimes|required|string|max:25',
            'short_desc'  => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'price'       => 'nullable|numeric|min:0',
            'width'       => 'nullable|integer',
            'height'      => 'nullable|integer',
            'depth'       => 'nullable|integer',
            'unit'        => 'nullable|string|max:10',
            'img'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Ambil semua data teks/angka
        $dataToUpdate = $request->except(['img', '_method']);

        // Jika Admin mengunggah gambar baru
        if ($request->hasFile('img')) {
            // Hapus gambar lama dari storage jika ada
            if ($size->img && Storage::disk('public')->exists($size->img)) {
                Storage::disk('public')->delete($size->img);
            }

            // Simpan gambar baru
            $file = $request->file('img');
            $folderPath = "products/{$size->product_id}/Size";
            $filename = "{$size->id}." . $file->getClientOriginalExtension();
            
            $file->storeAs($folderPath, $filename, 'public');
            $dataToUpdate['img'] = "{$folderPath}/{$filename}";
        }

        $size->update($dataToUpdate);

        return response()->json([
            'message' => 'Varian ukuran berhasil diperbarui',
            'data'    => $size
        ]);
    }

    // 4. DELETE /product-sizes/{id} - Menghapus ukuran beserta gambarnya
    public function destroy($id)
    {
        $size = ProductSizes::findOrFail($id);

        // Hapus fisik gambar
        if ($size->img && Storage::disk('public')->exists($size->img)) {
            Storage::disk('public')->delete($size->img);
        }

        $size->delete();

        return response()->json(['message' => 'Varian ukuran berhasil dihapus']);
    }
}