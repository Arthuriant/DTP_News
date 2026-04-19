<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManagerStatic as Image;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    /**
     * Display all products
     */
    public function index()
    {
        $products = Product::with('subCategory')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $products
        ], 200);
    }

    /**
     * Store new product
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

        return DB::transaction(function () use ($request) {
            $product = Product::create([
                'sub_categories_id' => $request->sub_categories_id,
                'name'              => $request->name,
                'description'       => $request->description,
                'summary'           => $request->summary,
                'base_price'        => $request->base_price,
                'is_active'         => $request->is_active ?? true,
                'img'               => 'temporary'
            ]);

            // 2️⃣ Folder di storage/app/public
            $folderPath = "products/{$product->id}/Cover";
            Storage::disk('public')->makeDirectory($folderPath);
            $filename = "cover.webp";

            // ==========================================
            // KODE FINAL (VERSI 2): KOMPRESI WEBP
            // ==========================================
            // 1. Baca file mentah dari request
            $file = $request->file('img');
            
            // 2. Kompres ke WebP 80% menggunakan ImageManagerStatic
            $image = Image::make($file)->encode('webp', 80);
            
            // 3. Simpan ke Storage Laravel
            Storage::disk('public')->put("{$folderPath}/{$filename}", (string) $image);
            // ==========================================

            // 4️⃣ Simpan path ke DB
            $product->update([
                'img' => "{$folderPath}/{$filename}"
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data'    => $product
            ], 201);
        });
    }

    /**
     * Show single product
     */
    public function show($id)
    {
        $product = Product::with('subCategory')->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $product
        ], 200);
    }

    /**
     * Update product
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'sub_categories_id' => 'sometimes|exists:sub_categories,id',
            'name'              => 'sometimes|string|max:255',
            'description'       => 'nullable|string',
            'summary'           => 'nullable|string',
            'base_price'        => 'sometimes|numeric',
            'img'               => 'nullable|image|mimes:webp,jpg,jpeg,png|max:2048',
            'is_active'         => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request, $product) {

            $product->update($request->except('img'));

            if ($request->hasFile('img')) {
                $folderPath = "products/{$product->id}/Cover";

                // Hapus gambar cover lama
                if ($product->img && Storage::disk('public')->exists($product->img)) {
                    Storage::disk('public')->delete($product->img);
                }

                $filename = "cover.webp";

                // ==========================================
                // KODE FINAL (VERSI 2): KOMPRESI WEBP
                // ==========================================
                $file = $request->file('img');
                $image = Image::make($file)->encode('webp', 80);
                
                Storage::disk('public')->put("{$folderPath}/{$filename}", (string) $image);
                // ==========================================

                // ✅ SIMPAN PATH MURNI TANPA KATA "storage/"
                $product->update([
                    'img' => "{$folderPath}/{$filename}"
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data'    => $product
            ], 200);
        });
    }

    /**
     * Delete product
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return DB::transaction(function () use ($product) {

            // Hapus seluruh folder product
            Storage::disk('public')
                ->deleteDirectory("products/{$product->id}");

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ], 200);
        });
    }
}
