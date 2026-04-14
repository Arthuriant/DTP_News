<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductMarketingBlocks;
use App\Models\ProductMarketingFeatures;

class ProductMarketingFeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            
            $blockInterior = ProductMarketingBlocks::where('product_id', $product->id)
                                                   ->where('title', 'Interior Terorganisir')
                                                   ->first();

            if ($blockInterior) {
                $featuresInterior = [
                    'Lapisan hitam pekat yang bersih',
                    'Kompartemen utama yang luas',
                    'Saku slip khusus untuk dua smartphone dan buku catatan',
                ];

                foreach ($featuresInterior as $title) {
                    ProductMarketingFeatures::create([
                        'product_id' => $product->id,
                        'block_id'   => $blockInterior->id,
                        'title'      => $title,
                    ]);
                }
            } else {
                $this->command->error('Blok "Interior Terorganisir" tidak ditemukan!');
            }

            $blockRetro = ProductMarketingBlocks::where('product_id', $product->id)
                                                ->where('title', 'Retro Modern')
                                                ->first();

            if ($blockRetro) {
                $featuresRetro = [
                    'Panel blok warna tiga nada',
                    'Kulit halus yang premium',
                ];

                foreach ($featuresRetro as $title) {
                    ProductMarketingFeatures::create([
                        'product_id' => $product->id,
                        'block_id'   => $blockRetro->id,
                        'title'      => $title,
                    ]);
                }
            } else {
                $this->command->error('Blok "Retro Modern" tidak ditemukan!');
            }

            $this->command->info('Data Product Marketing Features berhasil ditambahkan!');

        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}