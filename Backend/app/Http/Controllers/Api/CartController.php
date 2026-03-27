<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function store(Request $request)
    {
        // cek user login
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        // ambil user login
        $user = Auth::user();

        return response()->json([
            'message' => 'Produk masuk ke cart',
            'user_id' => $user->id,
            'product_id' => $request->product_id
        ]);
    }
}