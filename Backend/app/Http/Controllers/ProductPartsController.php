<?php

namespace App\Http\Controllers;

use App\Models\ProductParts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductPartsController extends Controller
{
    /**
     * GET /product-parts
     */
    public function index()
    {
        $data = ProductParts::with('product')->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ]);
    }

    /**
     * GET /product-parts/{id}
     */
    public function show($id)
    {
        $part = ProductParts::with('product')->find($id);

        if (!$part) {
            return response()->json([
                'message' => 'Product Part tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $part
        ]);
    }

    /**
     * POST /product-parts
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid|exists:products,id',
            'name'       => 'required|string|max:255',
            'part_code'  => 'required|string|max:255|unique:product_parts,part_code',
            'z_index'    => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request) {

            // 1️⃣ Simpan ke DB
            $part = ProductParts::create([
                'product_id' => $request->product_id,
                'name'       => $request->name,
                'part_code'  => $request->part_code, // tambah
                'z_index'    => $request->z_index,
            ]);

            // 2️⃣ Buat folder otomatis di storage/app/public
            $directory = "products/{$part->product_id}/parts/{$part->id}";

            Storage::disk('public')->makeDirectory($directory);

            return response()->json([
                'success' => true,
                'message' => 'Product part created successfully',
                'data'    => $part
            ], 201);
        });
    }

    /**
     * PUT /product-parts/{id}
     */
    public function update(Request $request, $id)
    {
        $part = ProductParts::find($id);

        if (!$part) {
            return response()->json([
                'message' => 'Product Part tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'product_id' => 'required|uuid|exists:products,id',
            'name'       => 'required|string|max:255',
            'part_code'  => 'required|string|max:255|unique:product_parts,part_code,' . $id, // tambah, ignore self
            'z_index'    => 'required|array'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return DB::transaction(function () use ($request, $part) {

            // Jika product_id berubah → pindahkan folder
            if ($part->product_id !== $request->product_id) {

                $oldPath = "products/{$part->product_id}/parts/{$part->id}";
                $newPath = "products/{$request->product_id}/parts/{$part->id}";

                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->move($oldPath, $newPath);
                }
            }

            $part->update([
                'product_id' => $request->product_id,
                'name'       => $request->name,
                'part_code'  => $request->part_code, // tambah
                'z_index'    => $request->z_index
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product Part berhasil diupdate',
                'data'    => $part
            ]);
        });
    }

    /**
     * DELETE /product-parts/{id}
     */
    public function destroy($id)
    {
        $part = ProductParts::find($id);

        if (!$part) {
            return response()->json([
                'message' => 'Product Part tidak ditemukan'
            ], 404);
        }

        return DB::transaction(function () use ($part) {

            $directory = "products/{$part->product_id}/parts/{$part->id}";

            // Hapus folder part
            Storage::disk('public')->deleteDirectory($directory);

            $part->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product Part berhasil dihapus'
            ]);
        });
    }
}
