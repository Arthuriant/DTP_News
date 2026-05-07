<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Payment;
use App\Models\Order;

class PaymentController extends Controller
{
    private $baseUrl;
    private $secretKey;

    public function __construct()
    {
        $this->baseUrl    = env('XENDIT_BASE_URL', 'https://api.xendit.co');
        $this->secretKey  = env('XENDIT_SECRET_KEY');
    }

    // 1. GET /payment/methods - Ambil metode pembayaran
    public function methods()
    {
        return response()->json([
            'success' => true,
            'data'    => [
                ['code' => 'BCA',     'name' => 'Bank BCA',     'type' => 'virtual_account'],
                ['code' => 'BNI',     'name' => 'Bank BNI',     'type' => 'virtual_account'],
                ['code' => 'BRI',     'name' => 'Bank BRI',     'type' => 'virtual_account'],
                ['code' => 'MANDIRI', 'name' => 'Bank Mandiri', 'type' => 'virtual_account'],
                ['code' => 'PERMATA', 'name' => 'Bank Permata', 'type' => 'virtual_account'],
                ['code' => 'QRIS',    'name' => 'QRIS',         'type' => 'qr_code'],
            ]
        ]);
    }

    // 2. POST /payment/create - Buat invoice pembayaran
    public function create(Request $request)
    {
        $request->validate([
            'order_id'     => 'required',
            'amount'       => 'required|integer|min:10000',
            'customer'     => 'required|array',
            'customer.name'  => 'required|string',
            'customer.email' => 'required|email',
            'items'        => 'required|array',
        ]);

        $response = Http::withBasicAuth($this->secretKey, '')
            ->post("{$this->baseUrl}/v2/invoices", [
                'external_id'      => $request->order_id,
                'amount'           => $request->amount,
                'payer_email'      => $request->customer['email'],
                'description'      => 'Pembayaran Order #' . $request->order_id,
                'customer'         => [
                    'given_names'   => $request->customer['name'],
                    'email'         => $request->customer['email'],
                    'mobile_number' => $request->customer['phone'] ?? '',
                ],
                'items'            => $request->items,
                'invoice_duration' => $request->expiry_duration ?? 86400,
                'success_redirect_url' => env('FRONTEND_URL', 'http://localhost:3000') . '/payment/success',
                'failure_redirect_url' => env('FRONTEND_URL', 'http://localhost:3000') . '/payment/failed',
            ]);

        $responseData = $response->json();

        // Simpan ke tabel payments
        if ($response->successful()) {
            Payment::create([
                'order_id'       => $request->order_id,
                'payment_method' => 'xendit_invoice',
                'amount'         => $request->amount,
                'status'         => 'pending',
                'receipt_url'    => $responseData['invoice_url'] ?? null,
                'payload'        => $responseData,
            ]);

            // Update status order
            Order::where('id', $request->order_id)->update([
                'status' => 'pending_payment',
            ]);
        }

        return response()->json($responseData, $response->status());
    }

    // 3. GET /payment/status/{id}
    public function status($id)
    {
        $response = Http::withBasicAuth($this->secretKey, '')
            ->get("{$this->baseUrl}/v2/invoices/{$id}");

        return response()->json($response->json(), $response->status());
    }

    // 4. POST /payment/callback - Webhook dari Xendit
    public function callback(Request $request)
    {
        \Log::info('Xendit Callback masuk:', $request->all());

        $webhookToken = $request->header('x-callback-token');
        if ($webhookToken !== env('XENDIT_WEBHOOK_TOKEN')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $externalId = $request->external_id;
        $status     = $request->status;

        \Log::info("External ID: {$externalId}, Status: {$status}");

        // ✅ Validasi UUID dulu sebelum query
        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $externalId)) {
            \Log::warning("External ID bukan UUID valid: {$externalId}");
            return response()->json(['message' => 'Invalid order ID format'], 200);
        }

        $order = Order::find($externalId);
        if (!$order) {
            return response()->json(['message' => 'Order tidak ditemukan'], 200);
        }

        if ($status === 'PAID') {
            $order->update(['status' => 'processing']);
            Payment::where('order_id', $order->id)
                ->update([
                    'status'       => 'paid',
                    'payment_date' => now(),
                ]);
        } elseif (in_array($status, ['EXPIRED', 'FAILED'])) {
            $order->update(['status' => 'cancelled']);
            Payment::where('order_id', $order->id)
                ->update(['status' => 'failed']);
        }

        return response()->json(['message' => 'Webhook processed'], 200);
    }
}
