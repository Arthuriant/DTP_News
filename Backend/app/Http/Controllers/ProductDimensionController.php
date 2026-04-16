<?php

namespace App\Http\Controllers;

use App\Models\ProductDimensions;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductDimensionController extends Controller
{
    // 1. GET /product-dimensions/{product_id} - Mengambil detail dimensi
    public function show($productId)
    {
        $dimension = ProductDimensions::where('product_id', $productId)->first();

        if (!$dimension) {
            return response()->json(['message' => 'Data dimensi belum diatur untuk produk ini'], 404);
        }

        return response()->json($dimension);
    }

    // 2. POST /product-dimensions/{product_id} - Membuat ATAU Mengubah Dimensi (Upsert)
    public function store(Request $request, $productId)
    {
        // Validasi input (semuanya opsional karena admin mungkin cuma mau isi deskripsi atau upload gambar saja)
        $request->validate([
            'product_style' => 'nullable|string|max:50',
            'total_volumes' => 'nullable|integer',
            'weight'        => 'nullable|integer',
            'img'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Pastikan produknya benar-benar ada di database
        $product = Product::findOrFail($productId);

        // Ambil data dimensi saat ini (jika ada)
        $dimension = ProductDimensions::where('product_id', $productId)->first();

        // Data yang akan disimpan
        $dataToSave = $request->only(['product_style', 'total_volumes', 'weight']);

        // Jika Admin mengupload gambar baru
        if ($request->hasFile('img')) {
            // Hapus gambar dimensi yang lama dari storage (jika sebelumnya sudah pernah upload)
            if ($dimension && $dimension->img && Storage::disk('public')->exists($dimension->img)) {
                Storage::disk('public')->delete($dimension->img);
            }

            // Siapkan gambar baru
            $file = $request->file('img');
            // Sesuai request Anda: Folder Dimension
            $folderPath = "products/{$productId}/Dimension"; 
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Simpan gambar
            $file->storeAs($folderPath, $filename, 'public');
            
            // Masukkan path gambar ke array untuk disimpan di DB
            $dataToSave['img'] = "{$folderPath}/{$filename}";
        }

        // FUNGSI AJAIB LARAVEL: updateOrCreate
        // Jika product_id ditemukan, lakukan Update. Jika tidak ditemukan, lakukan Create.
        $savedDimension = ProductDimensions::updateOrCreate(
            ['product_id' => $productId], 
            $dataToSave 
        );

        return response()->json([
            'message' => 'Detail dimensi produk berhasil disimpan!',
            'data'    => $savedDimension
        ]);
    }

    // 3. DELETE /product-dimensions/{product_id} - Menghapus dimensi (dan gambarnya)
    public function destroy($productId)
    {
        $dimension = ProductDimensions::where('product_id', $productId)->first();

        if (!$dimension) {
            return response()->json(['message' => 'Data dimensi tidak ditemukan'], 404);
        }

        // Hapus file fisik gambar jika ada
        if ($dimension->img && Storage::disk('public')->exists($dimension->img)) {
            Storage::disk('public')->delete($dimension->img);
        }

        // Hapus data dari database
        $dimension->delete();

        return response()->json(['message' => 'Data dimensi berhasil dihapus']);
    }
}