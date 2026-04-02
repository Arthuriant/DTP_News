<?php

namespace App\Http\Controllers;

use App\Models\SaveBag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SavebagController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id'     => 'required|string',
            'size_id'        => 'required|string',
            'selected_parts' => 'required|array',
            'total_price'    => 'required|numeric',
            'design_name'    => 'nullable|string',
        ]);

        $saveBag = SaveBag::create([
            'user_id'        => Auth::id() ?? 1, // Fallback ke ID 1 untuk testing jika belum login
            'product_id'     => $validated['product_id'],
            'size_id'        => $validated['size_id'],
            'selected_parts' => $validated['selected_parts'],
            'total_price'    => $validated['total_price'],
            'design_name'    => $validated['design_name'] ?? 'Custom Bag ' . now()->format('d/m/Y'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Desain tas berhasil disimpan!',
            'data' => $saveBag
        ], 201);
    }

    public function index()
    {
        $data = SaveBag::where('user_id', Auth::id())->get();
        return response()->json($data);
    }
}
