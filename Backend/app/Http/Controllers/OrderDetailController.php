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

                    'total_amount'      => $orderDetail->order->total_amount,
                    'shipping_address'  => $orderDetail->order->shipping_address,
                    'resi'              => $orderDetail->order->resi,
                    'status'            => $orderDetail->order->status,
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
        $orderDetail = \App\Models\OrderDetail::with(['order.user', 'product'])
            ->where('order_id', $id)
            ->firstOrFail();

        $config = $orderDetail->custom_configuration;
        $parts = $config['parts'] ?? [];
        $visibleParts = $config['visibleParts'] ?? [];

        // Hapus use ($parts, ...) karena di PHP modern $this otomatis terbawa
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
                    $maskUrl = '';

                    // Tangkap URL Base & URL Mask
                    if ($pov === 'front') {
                        $imgUrl = $texture['img_front'] ?? '';
                        $maskUrl = $texture['img_front_mask'] ?? '';
                    } elseif ($pov === 'back') {
                        $imgUrl = $texture['img_back'] ?? '';
                        $maskUrl = $texture['img_back_mask'] ?? '';
                    } elseif ($pov === 'top') {
                        $imgUrl = $texture['img_top'] ?? '';
                        $maskUrl = $texture['img_top_mask'] ?? '';
                    }

                    if (empty($imgUrl)) continue;

                    // Konversi URL Web menjadi Path Folder Lokal Server
                    if (str_contains($imgUrl, '127.0.0.1:8000/storage/')) {
                        $path = str_replace('http://127.0.0.1:8000/storage/', '', $imgUrl);
                        $imgUrl = storage_path('app/public/' . $path);
                    }
                    if (!empty($maskUrl) && str_contains($maskUrl, '127.0.0.1:8000/storage/')) {
                        $maskPath = str_replace('http://127.0.0.1:8000/storage/', '', $maskUrl);
                        $maskUrl = storage_path('app/public/' . $maskPath);
                    }

                    // 👇 PROSES PEWARNAAN MASKING UNTUK PDF 👇
                    $isColorable = $texture['is_colorable'] ?? false;
                    $selectedColor = $texture['selected_color'] ?? null;

                    if ($isColorable && !empty($maskUrl) && $selectedColor && $selectedColor !== '#FFFFFF') {
                        // Panggil fungsi render gambar fisik
                        $imgUrl = $this->generateColorizedImage($imgUrl, $maskUrl, $selectedColor);
                    }
                    // 👆 =================================== 👆

                    $zIndex = $part['z_index'][ucfirst($pov)] ?? 10;

                    $layers[] = [
                        'image' => $imgUrl,
                        'z_index' => $zIndex
                    ];
                }
            }

            // Urutkan tumpukan layer berdasarkan z-index
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

        // Render PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.order_reference', $data)->setPaper('a4', 'portrait');
        return $pdf->download('Lembar-Kerja-Mahakarya-'.$id.'.pdf');
    }

    
    private function generateColorizedImage($basePath, $maskPath, $hexColor)
    {
        if (!file_exists($basePath) || !file_exists($maskPath)) {
            return $basePath;
        }

        $tempDir = storage_path('app/public/temp_pdf');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $tempFileName = 'colored_' . md5($basePath . $maskPath . $hexColor) . '.png';
        $tempFilePath = $tempDir . '/' . $tempFileName;

        if (file_exists($tempFilePath)) {
            return $tempFilePath; 
        }

        $baseImg = @imagecreatefromstring(file_get_contents($basePath));
        $maskImg = @imagecreatefromstring(file_get_contents($maskPath));

        if (!$baseImg || !$maskImg) return $basePath;

        $w = imagesx($baseImg);
        $h = imagesy($baseImg);

        $outImg = imagecreatetruecolor($w, $h);
        imagealphablending($outImg, false);
        imagesavealpha($outImg, true);
        $transparent = imagecolorallocatealpha($outImg, 0, 0, 0, 127);
        imagefill($outImg, 0, 0, $transparent);

        $hexColor = ltrim($hexColor, '#');
        if (strlen($hexColor) == 3) {
            $r = hexdec(str_repeat(substr($hexColor, 0, 1), 2));
            $g = hexdec(str_repeat(substr($hexColor, 1, 1), 2));
            $b = hexdec(str_repeat(substr($hexColor, 2, 1), 2));
        } else {
            $r = hexdec(substr($hexColor, 0, 2));
            $g = hexdec(substr($hexColor, 2, 2));
            $b = hexdec(substr($hexColor, 4, 2));
        }

        for ($y = 0; $y < $h; $y++) {
            for ($x = 0; $x < $w; $x++) {
                $bColor = imagecolorat($baseImg, $x, $y);
                $bAlpha = ($bColor >> 24) & 0x7F;

                $mColor = imagecolorat($maskImg, $x, $y);
                $mAlpha = ($mColor >> 24) & 0x7F;

                if ($mAlpha < 127) {
                    $bR = ($bColor >> 16) & 0xFF;
                    $bG = ($bColor >> 8) & 0xFF;
                    $bB = $bColor & 0xFF;

                    $newR = (int)(($bR * $r) / 255);
                    $newG = (int)(($bG * $g) / 255);
                    $newB = (int)(($bB * $b) / 255);
                    
                    $newAlpha = max($bAlpha, $mAlpha);
                    
                    $color = imagecolorallocatealpha($outImg, $newR, $newG, $newB, $newAlpha);
                    imagesetpixel($outImg, $x, $y, $color);
                } else {
                    imagesetpixel($outImg, $x, $y, $bColor);
                }
            }
        }

        imagepng($outImg, $tempFilePath);

        imagedestroy($baseImg);
        imagedestroy($maskImg);
        imagedestroy($outImg);

        return $tempFilePath; 
    }
}