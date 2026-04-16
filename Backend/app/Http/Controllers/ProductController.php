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

            // 1️⃣ Buat product dulu
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
            $folderPath = "products/{$product->id}/cover";

            Storage::disk('public')->makeDirectory($folderPath);

            // 3️⃣ Simpan file sebagai cover.webp
            $request->file('img')->storeAs(
                $folderPath,
                'cover.webp',
                'public'
            );

            // 4️⃣ Simpan path ke DB
            $product->update([
                'img' => "storage/{$folderPath}/cover.webp"
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

            // 1️⃣ Update field biasa
            $product->update($request->except('img'));

            // 2️⃣ Jika upload gambar baru
            if ($request->hasFile('img')) {

                $folderPath = "products/{$product->id}/cover";

                // Hapus cover lama
                Storage::disk('public')->delete("{$folderPath}/cover.webp");

                // Simpan cover baru
                $request->file('img')->storeAs(
                    $folderPath,
                    'cover.webp',
                    'public'
                );

                $product->update([
                    'img' => "storage/{$folderPath}/cover.webp"
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
