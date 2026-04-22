<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\SubCategories; // Pastikan nama Model Anda sesuai
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // ========================================================================
    // BAGIAN 1: KATEGORI UTAMA
    // ========================================================================

    // GET /categories - Ambil semua kategori beserta sub-kategorinya
    public function index()
    {
        // Pastikan di model Category Anda sudah membuat relasi public function sub_categories()
        $categories = Categories::with('sub_categories')->orderBy('name', 'asc')->get();
        return response()->json($categories);
    }

    // POST /categories - Tambah kategori baru
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name',
            'description' => 'nullable|string|max:150',
        ]);

        $category = Categories::create([
            'id'          => (string) Str::uuid(),
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        // Muat relasi kosong agar format response konsisten untuk frontend
        $category->setRelation('sub_categories', collect([]));

        return response()->json($category, 201);
    }

    // PUT /categories/{id} - Ubah kategori
    public function update(Request $request, $id)
    {
        $category = Categories::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:100|unique:categories,name,' . $id,
            'description' => 'nullable|string|max:150',
        ]);

        $category->update([
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        $category->load('sub_categories'); // Muat ulang relasinya

        return response()->json($category);
    }

    // DELETE /categories/{id} - Hapus kategori
    public function destroy($id)
    {
        $category = Categories::findOrFail($id);
        
        // Berkat onDelete('cascade') di database, semua sub-kategori 
        // di dalam kategori ini akan otomatis ikut terhapus!
        $category->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }


    // ========================================================================
    // BAGIAN 2: SUB-KATEGORI
    // ========================================================================

    // POST /sub-categories - Tambah sub-kategori baru
    public function storeSubCategory(Request $request)
    {
        $request->validate([
            'categories_id' => 'required|exists:categories,id', // Harus UUID yang valid
            'name'          => 'required|string|max:100',
            'description'   => 'nullable|string|max:150',
        ]);

        $subCategory = SubCategories::create([
            'id'            => (string) Str::uuid(),
            'categories_id' => $request->categories_id,
            'name'          => $request->name,
            'description'   => $request->description,
        ]);

        return response()->json($subCategory, 201);
    }

    // PUT /sub-categories/{id} - Ubah sub-kategori
    public function updateSubCategory(Request $request, $id)
    {
        $subCategory = SubCategories::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string|max:150',
        ]);

        $subCategory->update([
            'name'        => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($subCategory);
    }

    // DELETE /sub-categories/{id} - Hapus sub-kategori
    public function destroySubCategory($id)
    {
        $subCategory = SubCategories::findOrFail($id);
        $subCategory->delete();

        return response()->json(['message' => 'Sub-Kategori berhasil dihapus']);
    }
}