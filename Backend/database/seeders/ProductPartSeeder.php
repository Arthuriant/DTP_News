<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductParts;
use App\Models\Product; 
use Illuminate\Support\Facades\Storage; 

class ProductPartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            
            $part = ProductParts::create([
                'product_id' => $product->id, 
                'name'       => 'Badan Tas Kiri',
                'z_index'    => [
                    'Front' => 20,
                    'Back'  => 10,
                    'Top'   => 10,
                ],
            ]);

            $folderPath = 'products/' . $product->id . '/Parts/' . $part->id;

            if (!Storage::disk('public')->exists($folderPath)) {
                Storage::disk('public')->makeDirectory($folderPath);
            }

            $this->command->info('Data Product Parts "Badan Tas Kiri" berhasil ditambahkan!');
            $this->command->info('Folder berhasil dibuat di: storage/app/public/' . $folderPath);
            
        } else {
            // Jika produk belum ada di database, beri tahu lewat terminal
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan! Pastikan ProductSeeder dijalankan lebih dulu.');
        }
    }
}