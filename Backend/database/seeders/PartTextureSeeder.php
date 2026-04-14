<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductParts;
use App\Models\PartVariants;
use App\Models\PartTextures;

class PartTextureSeeder extends Seeder
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
                
                $variant = PartVariants::where('part_id', $part->id)
                                       ->where('name', 'Tubuh Tas Original')
                                       ->first();

                if ($variant) {
                    
                    PartTextures::create([
                        'product_id' => $product->id, // UUID Produk
                        'part_id'    => $part->id,    // UUID Part
                        'variant_id' => $variant->id, // UUID Variant
                        'name'       => 'Eco Cordura Canvas',
                        'price'      => 0,            // Harga default
                    ]);

                    $this->command->info('Data Part Texture (Eco Cordura Canvas) berhasil ditambahkan!');
                    
                } else {
                    $this->command->error('Gagal: Variant "Tubuh Tas Original" tidak ditemukan!');
                }
                
            } else {
                $this->command->error('Gagal: Part "Badan Tas Kiri" tidak ditemukan!');
            }

        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}