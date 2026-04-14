<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::with('subCategory')
                               ->where('is_active', true)
                               ->orderBy('created_at', 'desc') 
                               ->get();

            return response()->json([
                'success' => true,
                'message' => 'Daftar produk berhasil diambil',
                'data'    => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produk: ' . $e->getMessage(),
                'data'    => null
            ], 500);
        }
    }
}
