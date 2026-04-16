<?php

namespace App\Http\Controllers;

use App\Models\PartVariants;
use App\Models\ProductParts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PartVariantsController extends Controller
{
    /**
     * GET /part-variants
     */
    public function index()
    {
        $data = PartVariants::with(['product', 'part'])->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ]);
    }

    /**
     * GET /part-variants/{id}
     */
    public function show($id)
    {
        $variant = PartVariants::with(['product', 'part'])->find($id);

        if (!$variant) {
            return response()->json([
                'message' => 'Part Variant tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $variant
        ]);
    }

    /**
     * POST /part-variants
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid|exists:products,id',
            'part_id'    => 'required|uuid|exists:product_parts,id',
            'name'       => 'required|string|max:255',
            'price'      => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request) {

            // Validasi tambahan: pastikan part milik product yang sama
            $part = ProductParts::find($request->part_id);

            if ($part->product_id !== $request->product_id) {
                return response()->json([
                    'message' => 'Part tidak sesuai dengan Product'
                ], 422);
            }

            // 1️⃣ Simpan ke DB
            $variant = PartVariants::create([
                'product_id' => $request->product_id,
                'part_id'    => $request->part_id,
                'name'       => $request->name,
                'price'      => $request->price,
            ]);

            // 2️⃣ Buat folder otomatis
            $directory = "products/{$variant->product_id}/parts/{$variant->id}";

            Storage::disk('public')->makeDirectory($directory);

            return response()->json([
                'success' => true,
                'message' => 'Part Variant created successfully',
                'data'    => $variant
            ], 201);
        });
    }

    /**
     * PUT /part-variants/{id}
     */
    public function update(Request $request, $id)
    {
        $variant = PartVariants::find($id);

        if (!$variant) {
            return response()->json([
                'message' => 'Part Variant tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid|exists:products,id',
            'part_id'    => 'required|uuid|exists:product_parts,id',
            'name'       => 'required|string|max:255',
            'price'      => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request, $variant) {

            $oldPath = "products/{$variant->product_id}/parts/{$variant->id}";
            $newPath = "products/{$request->product_id}/parts/{$variant->id}";

            // Jika product atau part berubah → pindahkan folder
            if ($oldPath !== $newPath) {
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->move($oldPath, $newPath);
                }
            }

            $variant->update([
                'product_id' => $request->product_id,
                'part_id'    => $request->part_id,
                'name'       => $request->name,
                'price'      => $request->price,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Part Variant updated successfully',
                'data'    => $variant
            ]);
        });
    }

    /**
     * DELETE /part-variants/{id}
     */
    public function destroy($id)
    {
        $variant = PartVariants::find($id);

        if (!$variant) {
            return response()->json([
                'message' => 'Part Variant tidak ditemukan'
            ], 404);
        }

        return DB::transaction(function () use ($variant) {

            $directory = "products/{$variant->product_id}/parts/{$variant->id}";

            Storage::disk('public')->deleteDirectory($directory);

            $variant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Part Variant berhasil dihapus'
            ]);
        });
    }
}
