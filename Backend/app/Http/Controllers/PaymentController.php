<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Payment;
use App\Models\Order;

class PaymentController extends Controller
{
    private $baseUrl;
    private $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('KOMERCE_PAYMENT_URL', 'https://api-sandbox.collaborator.komerce.id/user/api/v1/payment');
        $this->apiKey  = env('KOMERCE_PAYMENT_KEY');
    }

    public function methods()
    {
    $response = Http::withHeaders([
        'x-api-key'    => $this->apiKey,
        'Content-Type' => 'application/json',
    ])->get("{$this->baseUrl}/payment/methods");

        return response()->json($response->json(), $response->status());
    }

    // 2. POST /payment/create
    public function create(Request $request)
    {
        $request->validate([
            'order_id'       => 'required',
            'payment_type'   => 'required|string',
            'channel_code'   => 'required|string',
            'amount'         => 'required|integer|min:10000',
            'customer'       => 'required|array',
            'customer.name'  => 'required|string',
            'customer.email' => 'required|email',
            'customer.phone' => 'required|string',
            'items'          => 'required|array',
        ]);

        $response = Http::withHeaders([
            'x-api-key'    => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/create", [
            'order_id'         => $request->order_id,
            'payment_type'     => $request->payment_type,
            'channel_code'     => $request->channel_code,
            'amount'           => $request->amount,
            'customer'         => $request->customer,
            'items'            => $request->items,
            'expiry_duration'  => $request->expiry_duration ?? 86400,
            'callback_url'     => env('APP_URL') . '/payment/callback',
            'callback_api_key' => env('KOMERCE_CALLBACK_KEY'),
        ]);

        $responseData = $response->json();

        // Simpan ke tabel payments
        if ($response->successful()) {
            Payment::create([
                'order_id'       => $request->order_id,
                'payment_method' => $request->payment_type . ' - ' . $request->channel_code,
                'amount'         => $request->amount,
                'status'         => 'pending',
                'payload'        => $responseData,
            ]);

            // Update status order
            Order::where('id', $request->order_id)->update([
                'payment_method' => $request->payment_type . ' - ' . $request->channel_code,
                'status'         => 'pending_payment',
            ]);
        }

        return response()->json($responseData, $response->status());
    }

    // 3. GET /payment/status/{id}
    public function status($id)
    {
        $response = Http::withHeaders([
            'x-api-key'    => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->get("{$this->baseUrl}/status/{$id}");

        return response()->json($response->json(), $response->status());
    }

    // 4. POST /payment/callback - Notifikasi dari Komerce
    public function callback(Request $request)
    {
        \Log::info('Payment Callback:', $request->all());

        $orderId = $request->order_id;
        $status  = $request->status;

        // Update payment status
        Payment::where('order_id', $orderId)->update([
            'status'       => $status,
            'payment_date' => now(),
            'payload'      => $request->all(),
        ]);

        // Update order status
        if ($status === 'paid') {
            Order::where('id', $orderId)->update([
                'status' => 'processing',
            ]);
        } elseif ($status === 'expired' || $status === 'failed') {
            Order::where('id', $orderId)->update([
                'status' => 'cancelled',
            ]);
        }

        return response()->json(['message' => 'Callback received'], 200);
    }
}
