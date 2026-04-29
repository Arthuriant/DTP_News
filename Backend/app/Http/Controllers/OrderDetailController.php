<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException; 
use Barryvdh\DomPDF\Facade\Pdf;

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

    public function downloadPDF($id)
    {
        $orderDetail = OrderDetail::with(['order.user', 'product'])
            ->where('order_id', $id)
            ->firstOrFail();

        $config = $orderDetail->custom_configuration;
        $parts = $config['parts'] ?? [];
        $visibleParts = $config['visibleParts'] ?? [];

        $buildLayers = function($pov) use ($parts, $visibleParts) {
            $layers = [];
            
            foreach ($parts as $part) {
                if (isset($visibleParts[$part['id']]) && $visibleParts[$part['id']] === false) {
                    continue; 
                }

                $variant = $part['variants'][0] ?? null;
                $texture = $variant['textures'][0] ?? null;

                if ($texture) {
                    $imgUrl = '';
                    if ($pov === 'front') $imgUrl = $texture['img_front'] ?? '';
                    if ($pov === 'back') $imgUrl = $texture['img_back'] ?? '';
                    if ($pov === 'top') $imgUrl = $texture['img_top'] ?? '';

                    if (empty($imgUrl)) continue;
                    if (str_contains($imgUrl, '127.0.0.1:8000/storage/')) {
                        $path = str_replace('http://127.0.0.1:8000/storage/', '', $imgUrl);
                        $imgUrl = storage_path('app/public/' . $path);
                    }

                    $zIndex = $part['z_index'][ucfirst($pov)] ?? 10;

                    $layers[] = [
                        'image' => $imgUrl,
                        'z_index' => $zIndex
                    ];
                }
            }

            usort($layers, function($a, $b) {
                return $a['z_index'] <=> $b['z_index'];
            });

            return $layers;
        };

        $data = [
            'id_transaksi'    => $orderDetail->order->id,
            'customer'        => $orderDetail->order->user->name ?? 'Guest',
            'produk'          => $orderDetail->product->name ?? 'Custom Product',
            'tanggal_masuk'   => $orderDetail->order->order_date->format('d F Y H:i'),
            'layers_front'    => $buildLayers('front'),
            'layers_back'     => $buildLayers('back'),
            'layers_top'      => $buildLayers('top'),
            'detail_material' => $config,
        ];

        // 3. Render PDF
        $pdf = Pdf::loadView('pdf.order_reference', $data)->setPaper('a4', 'portrait');
        return $pdf->download('Lembar-Kerja-Mahakarya-'.$id.'.pdf');
    }
}