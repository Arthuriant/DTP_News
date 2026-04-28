<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ShippingController extends Controller
{
    private $baseUrl;
    private $apiKey;

    public function __construct()
{
    $this->baseUrl = env('KOMERCE_BASE_URL', 'https://rajaongkir.komerce.id/api/v1');
    $this->apiKey  = env('KOMERCE_SHIPPING_KEY');
}

public function destinations(Request $request)
{
    $response = Http::withHeaders([
        'key' => $this->apiKey, // ← pakai 'key'
    ])->get("{$this->baseUrl}/destination/domestic-destination", [
        'search' => $request->search ?? '',
        'limit'  => $request->limit  ?? 10,
        'offset' => $request->offset ?? 0,
    ]);

    return response()->json($response->json(), $response->status());
}

public function cost(Request $request)
{

    $request->validate([
        'origin'      => 'required|integer',
        'destination' => 'required|integer',
        'weight'      => 'required|integer',
        'courier'     => 'required|string',
    ]);

    $response = Http::withHeaders([
        'key'          => $this->apiKey,
        'Content-Type' => 'application/x-www-form-urlencoded',
    ])->asForm()->post("https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost", [
        'origin'      => $request->origin,
        'destination' => $request->destination,
        'weight'      => $request->weight,
        'courier'     => $request->courier,
        'price'       => $request->price ?? 'lowest',
    ]);

    return response()->json($response->json(), $response->status());
}

    // 4. GET /shipping/couriers - List kurir yang tersedia
    public function couriers()
    {
        $couriers = [
            ['code' => 'jne',     'name' => 'JNE'],
            ['code' => 'jnt',     'name' => 'J&T Express'],
            ['code' => 'sicepat', 'name' => 'SiCepat'],
            ['code' => 'pos',     'name' => 'POS Indonesia'],
            ['code' => 'tiki',    'name' => 'TIKI'],
            ['code' => 'wahana',  'name' => 'Wahana'],
            ['code' => 'anteraja','name' => 'AnterAja'],
        ];

        return response()->json([
            'success' => true,
            'data'    => $couriers,
        ]);
    }

    public function provinces()
    {
        $response = Http::withHeaders([
            'key' => $this->apiKey,
        ])->get("{$this->baseUrl}/destination/province");

        return response()->json($response->json(), $response->status());
    }
}
