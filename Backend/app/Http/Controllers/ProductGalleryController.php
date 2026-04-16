<?php

namespace App\Http\Controllers;

use App\Models\ProductGalleries;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductGalleryController extends Controller
{
    // 1. GET /product-galleries/{product_id} - Mengambil galeri berdasarkan produk
    public function index($productId)
    {
        // Ambil gambar dan urutkan berdasarkan sort_order (kiri-atas ke kanan-bawah)
        $galleries = ProductGalleries::where('product_id', $productId)
            ->orderBy('sort_order', 'asc')
            ->get();

        return response()->json($galleries);
    }

    // 2. POST /product-galleries - Upload Gambar Baru
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'images'     => 'required|array',
            'images.*'   => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // Maks 5MB per gambar
        ]);

        $productId = $request->product_id;
        $uploadedGalleries = [];

        // Ambil urutan terakhir untuk produk ini agar gambar baru ditaruh di akhir
        $lastOrder = ProductGalleries::where('product_id', $productId)->max('sort_order') ?? -1;

        foreach ($request->file('images') as $index => $file) {
            // Kita buat UUID manual di awal agar bisa dipakai sebagai nama file
            $galleryId = (string) Str::uuid();
            
            // Format nama file: {gallery_id}.ekstensi
            $extension = $file->getClientOriginalExtension();
            $filename = "{$galleryId}.{$extension}";
            
            // Struktur Folder: products/{product_id}/Gallery
            $folderPath = "products/{$productId}/Gallery";

            // Simpan file ke folder storage/app/public/products/...
            $file->storeAs($folderPath, $filename, 'public');

            // Simpan path-nya ke Database
            $gallery = ProductGalleries::create([
                'id'         => $galleryId,
                'product_id' => $productId,
                'sort_order' => $lastOrder + 1 + $index, // Lanjutkan urutan
                'img'        => "{$folderPath}/{$filename}"
            ]);

            $uploadedGalleries[] = $gallery;
        }

        return response()->json([
            'message' => count($uploadedGalleries) . ' gambar berhasil diunggah!',
            'data'    => $uploadedGalleries
        ], 201);
    }

    // 3. DELETE /product-galleries/{id} - Hapus Gambar
    public function destroy($id)
    {
        $gallery = ProductGalleries::findOrFail($id);

        // Hapus file fisik dari storage
        if (Storage::disk('public')->exists($gallery->img)) {
            Storage::disk('public')->delete($gallery->img);
        }

        // Hapus data dari database
        $gallery->delete();

        return response()->json(['message' => 'Gambar berhasil dihapus']);
    }

    // 4. PUT /product-galleries/reorder - Mengatur ulang posisi gambar (kiri/kanan/atas/bawah)
    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:product_galleries,id',
            'orders.*.sort_order' => 'required|integer',
        ]);

        // Update sort_order secara massal
        foreach ($request->orders as $order) {
            ProductGalleries::where('id', $order['id'])->update(['sort_order' => $order['sort_order']]);
        }

        return response()->json(['message' => 'Urutan gambar berhasil diperbarui']);
    }
}