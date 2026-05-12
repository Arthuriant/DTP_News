<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Categories;
use App\Models\SubCategories;
use App\Models\Product; // Pastikan model Product Anda diimport
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

        $category->load('sub_categories');

        return response()->json($category);
    }

    // DELETE /categories/{id} - Hapus kategori
    public function destroy($id)
    {
        $category = Categories::findOrFail($id);
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
            'categories_id' => 'required|exists:categories,id',
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


    // ========================================================================
    // BAGIAN 3: ENDPOINT BARU - KATEGORI DENGAN JUMLAH PRODUK (untuk Filter)
    // ========================================================================

    /**
     * GET /categories/with-product-count
     * Mengembalikan semua kategori beserta sub-kategorinya,
     * masing-masing dilengkapi dengan jumlah produk yang dimiliki.
     *
     * Endpoint ini digunakan oleh halaman toko (ShopWithSidebar)
     * untuk menampilkan daftar filter kategori yang dinamis.
     */
        public function indexWithProductCount()
    {
        $categories = Categories::with('sub_categories')
            ->orderBy('name', 'asc')
            ->get();

        $formatted = $categories->map(function ($category) {
            $formattedSubs = $category->sub_categories->map(function ($sub) {
                return [
                    'id'          => $sub->id,
                    'name'        => $sub->name,
                    'description' => $sub->description,
                    'products'    => 0, // nanti diisi setelah tabel products siap
                ];
            });

            return [
                'id'             => $category->id,
                'name'           => $category->name,
                'description'    => $category->description,
                'products'       => 0, // nanti diisi setelah tabel products siap
                'sub_categories' => $formattedSubs,
            ];
        });

        return response()->json($formatted);
    }

    // ========================================================================
    // BAGIAN 4: ENDPOINT BARU - FILTER PRODUK BERDASARKAN KATEGORI / SUB-KATEGORI
    // ========================================================================

    /**
     * GET /products/filter
     * Memfilter produk berdasarkan satu atau lebih kategori/sub-kategori,
     * jenis kelamin, ukuran, warna, dan rentang harga.
     *
     * Query Parameters yang didukung:
     *  - category_ids[]    : array UUID kategori utama (opsional)
     *  - sub_category_ids[]: array UUID sub-kategori (opsional)
     *  - genders[]         : array string, mis. ['Pria', 'Wanita', 'Uniseks'] (opsional)
     *  - sizes[]           : array string, mis. ['M', 'L', 'XL'] (opsional)
     *  - colors[]          : array string, mis. ['Merah', 'Biru'] (opsional)
     *  - min_price         : integer harga minimum (opsional)
     *  - max_price         : integer harga maksimum (opsional)
     *  - sort_by           : string opsi pengurutan (opsional)
     *                        'latest' | 'best_seller' | 'price_asc' | 'price_desc'
     *
     * Catatan: Sesuaikan nama kolom di bawah ini dengan struktur tabel produk Anda.
     */
   // Pastikan Anda sudah mengimport model ini di atas file Controller:
    // use App\Models\Product;
    // use Illuminate\Support\Facades\DB;

    public function filterProducts(Request $request)
    {
        $request->validate([
            'category_ids'       => 'nullable|array',
            'category_ids.*'     => 'string',
            'sub_category_ids'   => 'nullable|array',
            'sub_category_ids.*' => 'string',
            'genders'            => 'nullable|array',
            'genders.*'          => 'string|max:50',
            'sizes'              => 'nullable|array',
            'sizes.*'            => 'string|max:20',
            'colors'             => 'nullable|array',
            'colors.*'           => 'string|max:50',
            'min_price'          => 'nullable|integer|min:0',
            'max_price'          => 'nullable|integer|min:0',
            'sort_by'            => 'nullable|string|in:latest,best_seller,price_asc,price_desc',
        ]);

        $query = Product::where('is_active', true);

        $hasCategoryFilter    = $request->filled('category_ids');
        $hasSubCategoryFilter = $request->filled('sub_category_ids');

        if ($hasCategoryFilter || $hasSubCategoryFilter) {
            $query->where(function ($q) use ($request, $hasCategoryFilter, $hasSubCategoryFilter) {
                if ($hasCategoryFilter) {
                    $subIds = DB::table('sub_categories')
                        ->whereIn('categories_id', $request->category_ids)
                        ->pluck('id');
                    $q->whereIn('sub_categories_id', $subIds);
                }
                if ($hasSubCategoryFilter) {
                    $method = $hasCategoryFilter ? 'orWhereIn' : 'whereIn';
                    $q->$method('sub_categories_id', $request->sub_category_ids);
                }
            });
        }

        // --- Filter Harga ---
        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->max_price);
        }

        // --- Pengurutan ---
        switch ($request->input('sort_by', 'latest')) {
            case 'price_asc':
                $query->orderBy('base_price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('base_price', 'desc');
                break;
            case 'latest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return response()->json($query->get());
    }
}
