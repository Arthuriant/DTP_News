<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductParts;
use App\Models\Product; // 👈 Jangan lupa import model Product

class ProductPartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            
            ProductParts::create([
                'product_id' => $product->id, 
                'name'       => 'Badan Tas Kiri',
                'z_index'    => [
                    'Front' => 20,
                    'Back'  => 10,
                    'Top'   => 10,
                ],
            ]);

            $this->command->info('Data Product Parts berhasil ditambahkan ke ' . $product->name);
            
        } else {
            // Jika produk belum ada di database, beri tahu lewat terminal
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan! Pastikan ProductSeeder dijalankan lebih dulu.');
        }
    }
}