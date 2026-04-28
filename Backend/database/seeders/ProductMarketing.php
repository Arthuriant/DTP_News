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
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            
            $marketingData = [
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
            ];

            // Path sumber gambar dummy Anda
            $sourcePath = database_path('seeders/Product_Dummy/marketing');

            foreach ($marketingData as $data) {
                
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
                    $this->command->warn('Gambar tidak ditemukan: ' . $sourceFile);
                }

                foreach ($data['features'] as $featureTitle) {
                    ProductMarketingFeatures::create([
                        'product_id' => $product->id,
                        'block_id'   => $block->id,
                        'title'      => $featureTitle,
                    ]);
                }

                $this->command->info('Data, Folder & Gambar untuk Marketing "' . $data['title'] . '" berhasil dibuat!');
            }

            $this->command->info('==== SEMUA DATA PRODUCT MARKETING BERHASIL DITAMBAHKAN ====');
            
        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}