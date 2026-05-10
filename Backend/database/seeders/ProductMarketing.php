<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductMarketingBlocks;
use App\Models\ProductMarketingFeatures;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProductMarketing extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productsData = [
            [
                'product_name' => 'Classic Messenger Bag',
                'dummy_folder' => 'Product_Dummy',
                'marketing_data' => [
                    [
                        'title'        => 'Interior Terorganisir',
                        'subtitle'     => 'Kejelasan Tanpa Kompromi',
                        'description'  => 'Lapisan dalam hitam pekat yang bersih memberikan kejelasan visual. Menampilkan kompartemen utama yang luas yang menampung barang-barang penting Anda, termasuk saku slip khusus untuk buku catatan dan dua smartphone, menjaga semuanya dalam jangkauan.',
                        'source_image' => 'marketing-1.webp',
                        'features'     => [
                            'Lapisan hitam',
                            'Kompartemen utama',
                            'Saku slip khusus'
                        ]
                    ],
                    [
                        'title'        => 'Retro Modern',
                        'subtitle'     => 'Harmoni Blok Warna',
                        'description'  => 'Rasakan pernyataan desain yang kuat dengan panel blok warna vertikal ikonik kami. Abu-abu muda, merah cerah, dan kuning cerah bersatu dalam harmoni minimalis. Terbuat dari kulit halus yang premium untuk tampilan yang bersih dan canggih.',
                        'source_image' => 'marketing-2.webp',
                        'features'     => [
                            'Panel blok warna',
                            'Kulit halus'
                        ]
                    ]
                ]
            ],

            [
                'product_name' => 'Classic Top Handle Bag', 
                'dummy_folder' => 'Product_Dummy_2',
                'marketing_data' => [
                    [
                        'title'        => 'Elegan & Fungsional',
                        'subtitle'     => 'Gaya untuk Setiap Kesempatan',
                        'description'  => 'Desain top handle yang klasik memberikan kesan elegan untuk acara formal maupun gaya kasual Anda. Dilengkapi dengan kompartemen yang dirancang khusus untuk kemudahan akses tanpa mengorbankan bentuk.',
                        'source_image' => 'marketing-1.webp', 
                        'features'     => [
                            'Desain klasik',
                            'Akses mudah',
                            'Material premium'
                        ]
                    ],
                    [
                        'title'        => 'Kustomisasi Personal',
                        'subtitle'     => 'Cerminan Karakter Anda',
                        'description'  => 'Pilih dari berbagai pilihan kunci, pita, dan aksesori penunjang yang dapat disesuaikan untuk menciptakan mahakarya yang benar-benar mewakili gaya personal Anda.',
                        'source_image' => 'marketing-2.webp', 
                        'features'     => [
                            'Aksesori kustom',
                            'Detail eksklusif'
                        ]
                    ]
                ]
            ],

        ];

        foreach ($productsData as $productInfo) {
            $product = Product::where('name', $productInfo['product_name'])->first();

            if (!$product) {
                $this->command->error("Gagal: Produk '{$productInfo['product_name']}' tidak ditemukan! Lewati.");
                continue;
            }

            $this->command->info("\nMemproses marketing untuk produk: {$product->name}");
            $sourcePath = database_path("seeders/{$productInfo['dummy_folder']}/marketing");

            if (!File::exists($sourcePath)) {
                $this->command->warn(" - Folder marketing tidak ditemukan di: {$sourcePath}");
                continue;
            }

            foreach ($productInfo['marketing_data'] as $data) {
                
                $block = ProductMarketingBlocks::create([
                    'product_id'  => $product->id,
                    'title'       => $data['title'],
                    'subtitle'    => $data['subtitle'],
                    'description' => $data['description'],
                ]);

                $folderPath = 'products/' . $product->id . '/Marketing/' . $block->id;

                if (!Storage::disk('public')->exists($folderPath)) {
                    Storage::disk('public')->makeDirectory($folderPath);
                }

                $sourceFile = $sourcePath . '/' . $data['source_image'];
                $destinationPath = $folderPath . '/' . $data['source_image'];

                if (File::exists($sourceFile)) {
                    Storage::disk('public')->put($destinationPath, File::get($sourceFile));
                    $block->update(['img' => $destinationPath]);
                } else {
                    $this->command->warn(" - Gambar tidak ditemukan: {$sourceFile}");
                }

                foreach ($data['features'] as $featureTitle) {
                    ProductMarketingFeatures::create([
                        'product_id' => $product->id,
                        'block_id'   => $block->id,
                        'title'      => $featureTitle,
                    ]);
                }

                $this->command->info(" + Data, Folder & Gambar untuk Marketing '{$data['title']}' berhasil dibuat.");
            }
        }

        $this->command->info("\n==== SEMUA DATA PRODUCT MARKETING BERHASIL DITAMBAHKAN ====");
    }
}