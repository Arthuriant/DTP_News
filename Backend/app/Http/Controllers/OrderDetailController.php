<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException; 

class OrderDetailController extends Controller
{
    public function index($id)
    {   
        try {
            $orderDetail = OrderDetail::with([
                'order',       
                'order.user',   
                'product'       
            ])
            ->where('order_id', $id)
            ->firstOrFail();
            return response()->json([
                'success' => true,
                'data' => [
                    'id_transaksi'      => $orderDetail->order->id,
                    'customer'          => $orderDetail->order->user->name ?? 'Guest',
                    'produk'            => $orderDetail->product->name ?? 'Produk Tidak Ditemukan',
                    'tanggal_masuk'     => $orderDetail->order->order_date->format('Y-m-d H:i:s'),
                    'detail_material'   => $orderDetail->custom_configuration, 
                ]
            ]);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data pesanan tidak ditemukan di database.'
            ], 200); 
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat mengambil data.',
                'error'   => $e->getMessage() 
            ], 500); 
        }
    }
}