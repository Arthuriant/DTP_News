<?php

namespace App\Http\Controllers;

use App\Models\PartTextures;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PartTexturesController extends Controller
{
    /**
     * GET /part-textures
     */
    public function index(Request $request)
    {
        $query = PartTextures::with(['product', 'part', 'variant']);

        if ($request->has('variant_id')) {
            $query->where('variant_id', $request->variant_id);
        }
        $data = $query->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ]);
    }

    /**
     * GET /part-textures/{id}
     */
    public function show($id)
    {
        $texture = PartTextures::with(['product', 'part', 'variant'])->find($id);

        if (!$texture) {
            return response()->json([
                'message' => 'Texture tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $texture
        ]);
    }

    /**
     * POST /part-textures
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id'   => 'required|uuid|exists:products,id',
            'part_id'      => 'required|uuid|exists:product_parts,id',
            'variant_id'   => 'required|uuid|exists:part_variants,id',
            'name'         => 'required|string|max:255',
            'price'        => 'required|numeric',
            'texture_code' => 'required|string|max:255|unique:part_textures,texture_code',
            'is_colorable' => 'nullable', 
            'colors'       => 'nullable', 
            'top'          => 'required|image|mimes:webp|max:2048',
            'back'         => 'required|image|mimes:webp|max:2048',
            'front'        => 'required|image|mimes:webp|max:2048',
            'thumb'        => 'required|image|mimes:webp|max:2048',
            'top_mask'     => 'nullable|image|mimes:webp|max:2048',
            'back_mask'    => 'nullable|image|mimes:webp|max:2048',
            'front_mask'   => 'nullable|image|mimes:webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                $isColorable = filter_var($request->is_colorable, FILTER_VALIDATE_BOOLEAN);
                $colors = $request->colors;
                if (is_string($colors)) {
                    $colors = json_decode($colors, true); 
                }

                $texture = PartTextures::create([
                    'product_id'   => $request->product_id,
                    'part_id'      => $request->part_id,
                    'variant_id'   => $request->variant_id,
                    'name'         => $request->name,
                    'price'        => $request->price,
                    'texture_code' => $request->texture_code,
                    'is_colorable' => $isColorable,
                    'colors'       => $isColorable ? $colors : null,
                ]);

                $directory = "products/{$texture->product_id}/parts/{$texture->part_id}/{$texture->variant_id}/{$texture->id}";
                Storage::disk('public')->makeDirectory($directory);

                // 3️⃣ Bersihkan nama
                $cleanName = Str::slug($texture->name);

                $imagePaths = [];

                // Proses Gambar Base
                $imageFields = ['top', 'back', 'front', 'thumb'];
                foreach ($imageFields as $field) {
                    $fileName = "{$field}-{$cleanName}.webp";
                    $request->file($field)->storeAs($directory, $fileName, 'public');
                    $imagePaths["img_{$field}"] = "{$directory}/{$fileName}";
                }

                // Proses Gambar Masking (Jika ada dan is_colorable true)
                if ($isColorable) {
                    $maskFields = ['top_mask', 'back_mask', 'front_mask'];
                    foreach ($maskFields as $field) {
                        if ($request->hasFile($field)) {
                            $fileName = "{$field}-{$cleanName}.webp";
                            $request->file($field)->storeAs($directory, $fileName, 'public');
                            $imagePaths["img_{$field}"] = "{$directory}/{$fileName}";
                        }
                    }
                }

                // 4️⃣ Update kolom image
                $texture->update($imagePaths);

                return response()->json([
                    'success' => true,
                    'message' => 'Texture berhasil dibuat',
                    'data'    => $texture
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal membuat texture',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /part-textures/{id}
     */
    public function update(Request $request, $id)
    {
        $texture = PartTextures::find($id);

        if (!$texture) {
            return response()->json([
                'message' => 'Texture tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:255',
            'price'        => 'sometimes|numeric',
            'texture_code' => 'sometimes|string|max:255|unique:part_textures,texture_code,' . $id,
            
            'is_colorable' => 'nullable',
            'colors'       => 'nullable',

            'top'          => 'nullable|image|mimes:webp|max:2048',
            'back'         => 'nullable|image|mimes:webp|max:2048',
            'front'        => 'nullable|image|mimes:webp|max:2048',
            'thumb'        => 'nullable|image|mimes:webp|max:2048',

            'top_mask'     => 'nullable|image|mimes:webp|max:2048',
            'back_mask'    => 'nullable|image|mimes:webp|max:2048',
            'front_mask'   => 'nullable|image|mimes:webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            DB::beginTransaction();

            // Parsing is_colorable & colors
            $isColorable = $request->has('is_colorable') 
                ? filter_var($request->is_colorable, FILTER_VALIDATE_BOOLEAN) 
                : $texture->is_colorable;
                
            $colors = $request->has('colors') ? $request->colors : $texture->colors;
            if (is_string($colors)) {
                $colors = json_decode($colors, true);
            }

            // Update data teks
            $texture->update([
                'name'         => $request->name ?? $texture->name,
                'price'        => $request->price ?? $texture->price,
                'texture_code' => $request->texture_code ?? $texture->texture_code,
                'is_colorable' => $isColorable,
                'colors'       => $isColorable ? $colors : null,
            ]);

            // 🔥 FIX BUG PATH: Sesuaikan path agar sama dengan fungsi store()
            $directory = "products/{$texture->product_id}/parts/{$texture->part_id}/{$texture->variant_id}/{$texture->id}";
            $cleanName = Str::slug($texture->name);

            // Update Gambar Base
            $imageFields = ['top', 'back', 'front', 'thumb'];
            foreach ($imageFields as $field) {
                if ($request->hasFile($field)) {
                    $fileName = "{$field}-{$cleanName}.webp";
                    Storage::disk('public')->delete("{$directory}/{$fileName}");
                    $request->file($field)->storeAs($directory, $fileName, 'public');
                    
                    // FIX BUG: Hapus tulisan 'storage/' dari db path
                    $texture->update(["img_{$field}" => "{$directory}/{$fileName}"]);
                }
            }

            // Update Gambar Masking
            if ($isColorable) {
                $maskFields = ['top_mask', 'back_mask', 'front_mask'];
                foreach ($maskFields as $field) {
                    if ($request->hasFile($field)) {
                        $fileName = "{$field}-{$cleanName}.webp";
                        Storage::disk('public')->delete("{$directory}/{$fileName}");
                        $request->file($field)->storeAs($directory, $fileName, 'public');
                        $texture->update(["img_{$field}" => "{$directory}/{$fileName}"]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Texture berhasil diupdate',
                'data'    => $texture
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal update texture',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /part-textures/{id}
     */
    public function destroy($id)
    {
        $texture = PartTextures::find($id);

        if (!$texture) {
            return response()->json([
                'message' => 'Texture tidak ditemukan'
            ], 404);
        }

        try {
            DB::beginTransaction();

            $directory = "products/{$texture->product_id}/parts/{$texture->part_id}/{$texture->variant_id}/{$texture->id}";
            Storage::disk('public')->deleteDirectory($directory);
            
            $texture->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Texture berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menghapus texture',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}