<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductParts;
use App\Models\PartVariants;

class PartVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            
            $part = ProductParts::where('product_id', $product->id)
                                ->where('name', 'Badan Tas Kiri')
                                ->first();

            if ($part) {
                
                PartVariants::create([
                    'product_id' => $product->id, 
                    'part_id'    => $part->id,   
                    'name'       => 'Tubuh Tas Original',
                    'price'      => 0,           
                ]);

                $this->command->info('Data Part Variant (Tubuh Tas Original) berhasil ditambahkan!');
                
            } else {
                $this->command->error('Gagal: Part "Badan Tas Kiri" tidak ditemukan di produk ini!');
            }

        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}