<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductMarketingBlocks;

class ProductMarketingBlockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {

            $blocks = [
                [
                    'title'       => 'Interior Terorganisir',
                    'subtitle'    => 'Kejelasan Tanpa Kompromi',
                    'description' => 'Lapisan dalam hitam pekat yang bersih memberikan kejelasan visual. Menampilkan kompartemen utama yang luas yang menampung barang-barang penting Anda, termasuk saku slip khusus untuk buku catatan dan dua smartphone, menjaga semuanya dalam jangkauan.',
                ],
                [
                    'title'       => 'Retro Modern',
                    'subtitle'    => 'Harmoni Blok Warna',
                    'description' => 'Rasakan pernyataan desain yang kuat dengan panel blok warna vertikal ikonik kami. Abu-abu muda, merah cerah, dan kuning cerah bersatu dalam harmoni minimalis. Terbuat dari kulit halus yang premium untuk tampilan yang bersih dan canggih.',
                ]
            ];

            foreach ($blocks as $block) {
                ProductMarketingBlocks::create([
                    'product_id'  => $product->id,
                    'title'       => $block['title'],
                    'subtitle'    => $block['subtitle'],
                    'description' => $block['description'],
                ]);
            }

            $this->command->info('2 data Product Marketing Blocks berhasil ditambahkan untuk Classic Messenger Bag!');

        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}
