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
    public function index(Request $request)
    {

        $query = PartVariants::with(['product', 'part']);
        if ($request->has('part_id')) {
            $query->where('part_id', $request->part_id);
        }
        $data = $query->get();

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
            'variant_code' => 'required|string|max:255|unique:part_variants,variant_code', // tambah
            'price'      => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request) {

            $part = ProductParts::find($request->part_id);

            if ($part->product_id !== $request->product_id) {
                return response()->json([
                    'message' => 'Part tidak sesuai dengan Product'
                ], 422);
            }

            $variant = PartVariants::create([
                'product_id' => $request->product_id,
                'part_id'    => $request->part_id,
                'name'       => $request->name,
                'variant_code' => $request->variant_code, // tambah
                'price'      => $request->price,
            ]);

            $directory = "products/{$variant->product_id}/parts/{$variant->part_id}/{$variant->id}";

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
            'variant_code' => 'required|string|max:255|unique:part_variants,variant_code,' . $id, // tambah, ignore self
            'price'      => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request, $variant) {

            $oldPath = "products/{$variant->product_id}/parts/{$variant->part_id}/{$variant->id}";
            $newPath = "products/{$request->product_id}/parts/{$request->part_id}/{$variant->id}";

            if ($oldPath !== $newPath) {
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->move($oldPath, $newPath);
                }
            }

            $variant->update([
                'product_id' => $request->product_id,
                'part_id'    => $request->part_id,
                'name'       => $request->name,
                'variant_code' => $request->variant_code,
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

            $directory = "products/{$variant->product_id}/parts/{$variant->part_id}/{$variant->id}";

            Storage::disk('public')->deleteDirectory($directory);

            $variant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Part Variant berhasil dihapus'
            ]);
        });
    }
}
