<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    
    public function checkout(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string|min:10',
            'payment_method'   => 'nullable|string'
        ]);

        $user = auth('sanctum')->user();
        
        $cart = Cart::with('items')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->count() === 0) {
            return response()->json(['message' => 'Keranjang Anda kosong!'], 400);
        }

        DB::beginTransaction();

        try {
            // A. Buat Induk Pesanan (Order)
            $order = Order::create([
                'user_id'          => $user->id,
                'order_date'       => now(),
                'total_amount'     => $cart->total,
                'shipping_address' => $request->shipping_address,
                'payment_method'   => $request->payment_method ?? 'Manual Transfer', // Default simulasi
                'status'           => 'pending', // Status awal
                'created_by'       => $user->id,
            ]);

            // B. Pindahkan Barang (Cart Items -> Order Details)
            foreach ($cart->items as $item) {
                
                // Ambil kustomisasi yang ada, lalu gabungkan dengan image_preview
                $customConfig = $item->custom_configuration ?? [];
                $customConfig['image_preview'] = $item->image_preview; // 👈 Menyelamatkan gambar desain!

                OrderDetail::create([
                    'order_id'             => $order->id,
                    'product_id'           => $item->product_id,
                    'qty'                  => $item->qty,
                    'price'                => $item->price,
                    'custom_configuration' => $customConfig,
                    'created_by'           => $user->id,
                ]);
            }

            // C. Kosongkan Keranjang (Sapu Bersih!)
            $cart->items()->delete(); // Hapus semua barang di keranjang
            $cart->update(['total' => 0]); // Reset total keranjang jadi 0

            // 4. Jika semua sukses, kunci permanen datanya di Database
            DB::commit();

            return response()->json([
                'message'  => 'Checkout berhasil diproses!',
                'order_id' => $order->id // Kirim ID order ke frontend untuk halaman sukses
            ], 201);

        } catch (\Exception $e) {
            // Jika ada yang gagal, batalkan SEMUA proses (Rollback)
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal memproses pesanan, silakan coba lagi.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    
    public function getAllOrders()
    {
        $orders = Order::with(['user', 'details'])->orderBy('created_at', 'desc')->get();
        
        return response()->json($orders, 200);
    }

    public function getMyOrders(Request $request)
    {
        $user = auth('sanctum')->user();
        $query = Order::with(['details.product']) 
                      ->where('user_id', $user->id);
        
        if ($request->filled('date')) {
            $query->whereDate('order_date', $request->date);
        }
        $orders = $query->orderBy('created_at', 'desc')->get();
        
        $orders->transform(function ($order) {
            foreach ($order->details as $detail) {
                if ($detail->product && $detail->product->img) {
                    $detail->product->img_full_url = asset('storage/' . $detail->product->img);
                }
            }
            return $order;
        });
        
        return response()->json($orders, 200);
    }

    public function confirmDelivery($id)
    {
        $user = auth('sanctum')->user();
        
        $order = Order::where('id', $id)
                      ->where('user_id', $user->id)
                      ->firstOrFail();
        
        $order->status = 'completed'; 
        $order->save();

        return response()->json([
            'message' => 'Pesanan berhasil dikonfirmasi selesai', 
            'data' => $order
        ], 200);
    }
    
}