<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Tampilkan semua produk beserta sub-kategorinya.
     */
    public function index()
    {
        $products = Product::with('subCategory')->latest()->get();

        return response()->json([
            'success' => true,
            'data'    => $products
        ], 200);
    }

    /**
     * Simpan produk baru, buat folder otomatis, dan simpan gambar.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sub_categories_id' => 'required|exists:sub_categories,id',
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'summary'           => 'nullable|string',
            'base_price'        => 'required|numeric',
            'img'               => 'required|image|mimes:webp,jpg,jpeg,png|max:2048',
            'is_active'         => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                // 1. Buat record produk (UUID otomatis digenerate oleh model)
                $product = Product::create([
                    'sub_categories_id' => $request->sub_categories_id,
                    'name'              => $request->name,
                    'description'       => $request->description,
                    'summary'           => $request->summary,
                    'base_price'        => $request->base_price,
                    'is_active'         => $request->is_active ?? true,
                    'img'               => 'pending',
                ]);

                // 2. Logika Folder: product/{id}/Cover
                $folderPath = "product/{$product->id}/Cover";

                if ($request->hasFile('img')) {
                    $file = $request->file('img');
                    $fileName = "cover.webp";

                    // Simpan ke storage private
                    $path = $file->storeAs($folderPath, $fileName, 'local');

                    // 3. Update field img dengan path file yang baru
                    $product->update(['img' => $path]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Product created and folders initialized',
                    'data'    => $product
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create product', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Tampilkan detail satu produk.
     */
    public function show($id)
    {
        $product = Product::with('subCategory')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $product
        ], 200);
    }

    /**
     * Perbarui data produk dan gambar.
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'sub_categories_id' => 'sometimes|exists:sub_categories,id',
            'name'              => 'sometimes|string|max:255',
            'base_price'        => 'sometimes|numeric',
            'img'               => 'sometimes|image|mimes:webp,jpg,jpeg,png|max:2048',
            'is_active'         => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Jika ada upload gambar baru, timpa file lama
        if ($request->hasFile('img')) {
            $folderPath = "product/{$product->id}/Cover";
            $request->file('img')->storeAs($folderPath, "cover.webp", 'local');
            // Path di database tetap sama, jadi tidak wajib update field img jika namanya statis
        }

        $product->update($request->except('img'));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data'    => $product
        ], 200);
    }

    /**
     * Hapus produk beserta folder penyimpanannya.
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Hapus seluruh folder produk (termasuk folder Cover dan isinya)
        $directory = "product/{$product->id}";
        if (Storage::disk('local')->exists($directory)) {
            Storage::disk('local')->deleteDirectory($directory);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product and associated files deleted'
        ], 200);
    }
}
