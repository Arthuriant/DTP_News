<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductParts;
use App\Models\PartVariants;
use Illuminate\Support\Facades\Storage;

class PartVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if (!$product) {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
            return;
        }


        $partsVariantsMapping = [
            'Badan Tas Kiri' => [
                ['name' => 'Tubuh Tas Kiri Original', 'price' => 0],
            ],
            'Badan Tas Tengah' => [
                ['name' => 'Tubuh Tas Tengah Original', 'price' => 0],
            ],
            'Badan Tas Kanan' => [
                ['name' => 'Tubuh Tas Kanan Original', 'price' => 0],
            ],
            'Tali' => [
                ['name' => 'Tali Original', 'price' => 0],
                ['name' => 'Tali Selempang', 'price' => 20000],
                ['name' => 'Tali Rantai', 'price' => 30000],
            ],
            'Kunci' => [
                ['name' => 'Kunci Original', 'price' => 0],
            ],
        ];

        foreach ($partsVariantsMapping as $partName => $variants) {
            
            $part = ProductParts::where('product_id', $product->id)
                                ->where('name', $partName)
                                ->first();

            if ($part) {
                foreach ($variants as $variantData) {
                    
                    $variant = PartVariants::create([
                        'product_id' => $product->id, 
                        'part_id'    => $part->id,   
                        'name'       => $variantData['name'],
                        'price'      => $variantData['price'],           
                    ]);

                    $folderPath = 'products/' . $product->id . '/parts/' . $part->id . '/' . $variant->id;
                    if (!Storage::disk('public')->exists($folderPath)) {
                        Storage::disk('public')->makeDirectory($folderPath);
                        $this->command->info("Folder dibuat: {$folderPath}");
                    }

                    $this->command->info("Berhasil: Varian '{$variantData['name']}' untuk part '{$partName}' ditambahkan.");
                }
            } else {
                $this->command->warn("Peringatan: Part '{$partName}' tidak ditemukan. Lewati pembuatan varian.");
            }
        }
        
        $this->command->info('==== SEMUA PROSES SEEDING VARIANT SELESAI ====');
    }
}