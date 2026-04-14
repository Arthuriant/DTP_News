<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductGalleries;

class ProductGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cari produk Classic Messenger Bag
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            // Loop untuk membuat 4 urutan galeri
            for ($i = 1; $i <= 4; $i++) {
                ProductGalleries::create([
                    'product_id' => $product->id, // Ambil UUID produk secara otomatis
                    'sort_order' => $i,
                ]);
            }

            $this->command->info('4 data Product Galleries berhasil ditambahkan untuk Classic Messenger Bag!');
        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}