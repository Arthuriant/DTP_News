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

        try {
            return DB::transaction(function () use ($request) {

                // 1️⃣ Create product first
                $product = Product::create([
                    'sub_categories_id' => $request->sub_categories_id,
                    'name'              => $request->name,
                    'description'       => $request->description,
                    'summary'           => $request->summary,
                    'base_price'        => $request->base_price,
                    'is_active'         => $request->is_active ?? true,
                    'img'               => 'temporary' // isi sementara dulu
                ]);

                // 2️⃣ Define folder
                $folderPath = "private/{$product->id}/cover";
                $fileName   = "cover.webp";

                // 3️⃣ Paksa buat folder walaupun belum ada file
                Storage::disk('local')->makeDirectory($folderPath);

                // 4️⃣ Simpan file
                $request->file('img')->storeAs(
                    $folderPath,
                    $fileName,
                    'local'
                );

                // 5️⃣ Set path otomatis
                $imagePath = "{$folderPath}/{$fileName}";

                $product->update([
                    'img' => $imagePath
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Product created successfully',
                    'data'    => $product
                ], 201);
            });

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to create product',
                'error'   => $e->getMessage()
            ], 500);
        }
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

        try {
            DB::beginTransaction();

            // 1️⃣ Update basic fields
            $product->update($request->except('img'));

            // 2️⃣ Replace image if uploaded
            if ($request->hasFile('img')) {

                $folderPath = "private/{$product->id}/cover";
                $fileName   = "cover.webp";
                $fullPath   = $folderPath . '/' . $fileName;

                // delete old image
                if (Storage::disk('local')->exists($fullPath)) {
                    Storage::disk('local')->delete($fullPath);
                }

                $path = $request->file('img')
                    ->storeAs($folderPath, $fileName, 'local');

                $product->update([
                    'img' => $path
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data'    => $product
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update product',
                'error'   => $e->getMessage()
            ], 500);
        }
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

        try {
            DB::beginTransaction();

            // delete entire folder
            $directory = "private/{$product->id}";

            if (Storage::disk('local')->exists($directory)) {
                Storage::disk('local')->deleteDirectory($directory);
            }

            $product->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Failed to delete product',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
