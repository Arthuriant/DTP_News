<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Payment;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
        public function confirmReceived($id)
    {
        $user  = auth('sanctum')->user();
        $order = Order::where('id', $id)->where('user_id', $user->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order tidak ditemukan'], 404);
        }

        if ($order->status !== 'shipped') {
            return response()->json(['message' => 'Order belum dikirim'], 422);
        }

        $order->update(['status' => 'delivered']);

        return response()->json(['message' => 'Pesanan dikonfirmasi diterima.']);
    }
    public function checkout(Request $request)
    {
        $request->validate([
            'shipping_address'        => 'required|string|min:10',
            'payment_method'          => 'required|string',
            'shipping_cost'           => 'required|integer',
            'shipping_courier'        => 'required|string',
            'shipping_service'        => 'required|string',
            'origin_id'               => 'required|integer',
            'destination_id'          => 'required|integer',
            'customer_name'           => 'required|string',
            'customer_email'          => 'required|email',
            'customer_phone'          => 'required|string',
        ]);

        $user = auth('sanctum')->user();
        $cart = Cart::with('items')->where('user_id', $user->id)->first();

        if (!$cart || $cart->items->count() === 0) {
            return response()->json(['message' => 'Keranjang Anda kosong!'], 400);
        }

        DB::beginTransaction();

        try {
            // Total = cart total + ongkir
            $totalAmount = $cart->total + $request->shipping_cost;

            // A. Buat Order
            $order = Order::create([
                'user_id'          => $user->id,
                'order_date'       => now(),
                'total_amount'     => $totalAmount,
                'shipping_address' => $request->shipping_address,
                'payment_method'   => $request->payment_method,
                'status'           => 'pending',
                'created_by'       => $user->id,
            ]);

            // B. Pindahkan Cart Items ke Order Details
            foreach ($cart->items as $item) {
                $customConfig = $item->custom_configuration ?? [];
                $customConfig['image_preview'] = $item->image_preview;

                OrderDetail::create([
                    'order_id'             => $order->id,
                    'product_id'           => $item->product_id,
                    'qty'                  => $item->qty,
                    'price'                => $item->price,
                    'custom_configuration' => $customConfig,
                    'created_by'           => $user->id,
                ]);
            }

            // C. Buat Invoice Xendit
            $items = $cart->items->map(function ($item) {
                return [
                    'name'     => 'Produk Kustom',
                    'quantity' => $item->qty,
                    'price'    => (int) $item->price,
                ];
            })->toArray();

            // Tambah ongkir sebagai item
            $items[] = [
                'name'     => 'Biaya Pengiriman (' . $request->shipping_courier . ' - ' . $request->shipping_service . ')',
                'quantity' => 1,
                'price'    => $request->shipping_cost,
            ];

            $xenditResponse = Http::withBasicAuth(env('XENDIT_SECRET_KEY'), '')
                ->post(env('XENDIT_BASE_URL') . '/v2/invoices', [
                    'external_id'          => $order->id,
                    'amount'               => $totalAmount,
                    'payer_email'          => $request->customer_email,
                    'description'          => 'Pembayaran Order #' . $order->id,
                    'customer'             => [
                        'given_names'   => $request->customer_name,
                        'email'         => $request->customer_email,
                        'mobile_number' => $request->customer_phone,
                    ],
                    'items'                => $items,
                    'invoice_duration'     => 86400,
                    'success_redirect_url' => env('FRONTEND_URL') . '/',
                    'failure_redirect_url' => env('FRONTEND_URL') . '/order/failed',
                ]);

            $xenditData = $xenditResponse->json();

            // D. Simpan Payment
            Payment::create([
                'order_id'       => $order->id,
                'payment_method' => $request->payment_method,
                'amount'         => $totalAmount,
                'status'         => 'pending',
                'receipt_url'    => $xenditData['invoice_url'] ?? null,
                'payload'        => $xenditData,
            ]);

            // E. Kosongkan Keranjang
            $cart->items()->delete();
            $cart->update(['total' => 0]);

            DB::commit();

            return response()->json([
                'message'     => 'Checkout berhasil!',
                'order_id'    => $order->id,
                'invoice_url' => $xenditData['invoice_url'] ?? null,
                'total'       => $totalAmount,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal memproses pesanan.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function getAllOrders()
    {
        $orders = Order::with(['user', 'details'])->orderBy('created_at', 'desc')->get();
        return response()->json($orders, 200);
    }

    public function getMyOrders()
    {
        $user = auth('sanctum')->user();
        $orders = Order::with(['details', 'payment'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($orders, 200);
    }

    public function webhook(Request $request)
    {
        // Verifikasi token webhook dari Xendit
        $webhookToken = $request->header('x-callback-token');

        if ($webhookToken !== env('XENDIT_WEBHOOK_TOKEN')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $payload = $request->all();
        $externalId = $payload['external_id'] ?? null;
        $status     = $payload['status'] ?? null;

        if (!$externalId || !$status) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $order = Order::find($externalId);

        if (!$order) {
            return response()->json(['message' => 'Order tidak ditemukan'], 404);
        }

        // Update status berdasarkan status dari Xendit
        if ($status === 'PAID') {
            $order->update(['status' => 'confirmed']);

            // Update payment juga
            Payment::where('order_id', $order->id)
                ->update(['status' => 'paid']);
        } elseif ($status === 'EXPIRED') {
            $order->update(['status' => 'cancelled']);

            Payment::where('order_id', $order->id)
                ->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'Webhook processed']);
    }

}
