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
        $productsWithVariants = [
            
            [
                'product_name' => 'Classic Messenger Bag',
                'parts_variants' => [
                    'Badan Tas Kiri' => [
                        ['name' => 'Tubuh Tas Kiri Original', 'variant_code' => 'VAR-TUBUH-TAS-KIRI-ORIGINAL', 'price' => 0],
                    ],
                    'Badan Tas Tengah' => [
                        ['name' => 'Tubuh Tas Tengah Original', 'variant_code' => 'VAR-TUBUH-TAS-TENGAH-ORIGINAL', 'price' => 0],
                    ],
                    'Badan Tas Kanan' => [
                        ['name' => 'Tubuh Tas Kanan Original', 'variant_code' => 'VAR-TUBUH-TAS-KANAN-ORIGINAL', 'price' => 0],
                    ],
                    'Tali' => [
                        ['name' => 'Tali Original', 'variant_code' => 'VAR-TALI-ORIGINAL', 'price' => 0],
                        ['name' => 'Tali Selempang', 'variant_code' => 'VAR-TALI-SELEMPANG', 'price' => 20000],
                        ['name' => 'Tali Rantai', 'variant_code' => 'VAR-TALI-RANTAI', 'price' => 30000],
                    ],
                    'Kunci' => [
                        ['name' => 'Kunci Original', 'variant_code' => 'VAR-KUNCI-ORIGINAL', 'price' => 0],
                    ],
                ]
            ],

            [
                'product_name' => 'Classic Top Handle Bag', 
                'parts_variants' => [
                    'Badan' => [
                        ['name' => 'Badan Original', 'variant_code' => 'VAR-BADAN-ORIGINAL', 'price' => 0],
                    ],
                    'Kunci' => [
                        ['name' => 'Kunci Original', 'variant_code' => 'VAR-KUNCI-ORIGINAL', 'price' => 0],
                        ['name' => 'Kunci Sabuk', 'variant_code' => 'VAR-KUNCI-SABUK', 'price' => 100000],
                        ['name' => 'Kunci Guci', 'variant_code' => 'VAR-KUNCI-GUCI', 'price' => 200000],
                        ['name' => 'Kunci Elang', 'variant_code' => 'VAR-KUNCI-ELANG', 'price' => 220000],
                    ],
                    'Lidah Kanan' => [
                        ['name' => 'Lidah Kanan Original', 'variant_code' => 'VAR-LIDAH-KANAN-ORIGINAL', 'price' => 0],
                    ],
                    'Lidah Kiri' => [
                        ['name' => 'Lidah Kiri Original', 'variant_code' => 'VAR-LIDAH-KIRI-ORIGINAL', 'price' => 0],
                    ],
                    'Lidah Tengah' => [
                        ['name' => 'Lidah Tengah Original', 'variant_code' => 'VAR-LIDAH-TENGAH-ORIGINAL', 'price' => 0],
                    ],
                    'Pita' => [
                        ['name' => 'Pita Original', 'variant_code' => 'VAR-PITA-ORIGINAL', 'price' => 0],
                        ['name' => 'Pita Anjing', 'variant_code' => 'VAR-PITA-ANJING', 'price' => 10000],
                        ['name' => 'Pita Kitty', 'variant_code' => 'VAR-PITA-KITTY', 'price' => 20000],
                        ['name' => 'Pita Lucu', 'variant_code' => 'VAR-PITA-LUCU', 'price' => 30000],
                    ],
                    'Tali' => [
                        ['name' => 'Tali Original', 'variant_code' => 'VAR-TALI-ORIGINAL', 'price' => 0],
                    ],
                    'Tali Kunci' => [
                        ['name' => 'Tali Kunci Original', 'variant_code' => 'VAR-TALI-KUNCI-ORIGINAL', 'price' => 0],
                    ],
                ]
            ],

        ];

        foreach ($productsWithVariants as $productData) {
            $product = Product::where('name', $productData['product_name'])->first();

            if ($product) {
                $this->command->info("\nMemproses varian untuk produk: {$product->name}");
                foreach ($productData['parts_variants'] as $partName => $variants) {
                    
                    $part = ProductParts::where('product_id', $product->id)
                                        ->where('name', $partName)
                                        ->first();

                    if ($part) {
                        foreach ($variants as $variantData) {
                            $variant = PartVariants::create([
                                'product_id'   => $product->id,
                                'part_id'      => $part->id,
                                'name'         => $variantData['name'],
                                'variant_code' => $variantData['variant_code'],
                                'price'        => $variantData['price'],
                            ]);

                            // Buat direktori folder untuk gambar teksturnya nanti
                            $folderPath = 'products/' . $product->id . '/parts/' . $part->id . '/' . $variant->id;
                            if (!Storage::disk('public')->exists($folderPath)) {
                                Storage::disk('public')->makeDirectory($folderPath);
                            }

                            $this->command->info(" - Varian '{$variantData['name']}' berhasil ditambahkan ke part '{$partName}'.");
                        }
                    } else {
                        $this->command->warn(" [!] Part '{$partName}' tidak ditemukan pada produk {$product->name}. Lewati.");
                    }
                }
            } else {
                $this->command->error("Gagal: Produk '{$productData['product_name']}' tidak ditemukan di database!");
            }
        }

        $this->command->info("\n==== SEMUA PROSES SEEDING VARIANT SELESAI ====");
    }
}