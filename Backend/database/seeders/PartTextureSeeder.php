<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductParts;
use App\Models\PartVariants;
use App\Models\PartTextures;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PartTextureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productsData = [
            [
                'product_name' => 'Classic Messenger Bag',
                'dummy_folder' => 'Product_Dummy', 
                'texturesMapping' => [
                    'Badan Tas Kiri' => [
                        'Tubuh Tas Kiri Original' => [
                            ['name' => 'Eco Cordura Canvas', 'price' => 0, 'texture_code' => 'TEX-ECO-CORDURA-CANVAS'],
                        ],
                    ],
                    'Badan Tas Tengah' => [
                        'Tubuh Tas Tengah Original' => [
                            ['name' => 'Eco Cordura Canvas', 'price' => 0, 'texture_code' => 'TEX-ECO-CORDURA-CANVAS'],
                        ],
                    ],
                    'Badan Tas Kanan' => [
                        'Tubuh Tas Kanan Original' => [
                            ['name' => 'Eco Cordura Canvas', 'price' => 0, 'texture_code' => 'TEX-ECO-CORDURA-CANVAS'],
                        ],
                    ],
                    'Tali' => [
                        'Tali Original' => [
                            ['name' => 'Brass Metal', 'price' => 0, 'texture_code' => 'TEX-BRASS-METAL'],
                        ],
                        'Tali Selempang' => [
                            ['name' => 'Premium Leather', 'price' => 50000, 'texture_code' => 'TEX-PREMIUM-LEATHER'],
                        ],
                        'Tali Rantai' => [
                            ['name' => 'Gold Chain', 'price' => 15000, 'texture_code' => 'TEX-GOLD-CHAIN'],
                        ],
                    ],
                    'Kunci' => [
                        'Kunci Original' => [
                            ['name' => 'Eco Cordura Canvas', 'price' => 0, 'texture_code' => 'TEX-ECO-CORDURA-CANVAS'],
                        ],
                    ],
                ]
            ],

            [
                'product_name' => 'Classic Top Handle Bag', 
                'dummy_folder' => 'Product_Dummy_2',
                'texturesMapping' => [
                    'Badan' => [
                        'Badan Original' => [
                            ['name' => 'base', 'price' => 0, 'texture_code' => ''],
                            ['name' => 'leather1', 'price' => 100000, 'texture_code' => ''],
                            ['name' => 'leather2', 'price' => 120000, 'texture_code' => ''],
                            ['name' => 'leather3', 'price' => 130000, 'texture_code' => ''],
                            ['name' => 'leather4', 'price' => 140000, 'texture_code' => ''],
                            ['name' => 'leather5', 'price' => 150000, 'texture_code' => ''],
                        ],
                    ],
                    'Kunci' => [
                        'Kunci Original' => [
                            ['name' => 'Kunci1', 'price' => 0, 'texture_code' => ''],
                        ],
                        'Kunci Sabuk' => [
                            ['name' => 'Kunci2', 'price' => 0, 'texture_code' => ''],
                        ],
                        'Kunci Guci' => [
                            ['name' => 'Kunci3', 'price' => 0, 'texture_code' => ''],
                        ],
                        'Kunci Elang' => [
                            ['name' => 'Kunci4', 'price' => 0, 'texture_code' => ''],
                        ],
                    ],
                    'Lidah Kanan' => [
                        // 'Lidah Kanan Original' => [
                        //     ['name' => 'Lidah Kanan1', 'price' => 0, 'texture_code' => ''],
                        // ],
                    ],
                    'Lidah Kiri' => [
                        // 'Lidah Kiri Original' => [
                        //     ['name' => 'Lidah Kiri1', 'price' => 0, 'texture_code' => ''],
                        // ],
                    ],
                    'Lidah Tengah' => [
                        // 'Lidah Tengah Original' => [
                        //     ['name' => 'Lidah Tengah1', 'price' => 0, 'texture_code' => ''],
                        // ],
                    ],
                    'Pita' => [
                        'Pita Original' => [
                            ['name' => 'Pita1', 'price' => 0, 'texture_code' => ''],
                        ],
                        'Pita Anjing' => [
                            ['name' => 'Pita2', 'price' => 0, 'texture_code' => ''],
                        ],
                        'Pita Kitty' => [
                            ['name' => 'Pita3', 'price' => 0, 'texture_code' => ''],
                        ],
                        'Pita Lucu' => [
                            ['name' => 'Pita4', 'price' => 0, 'texture_code' => ''],
                        ],
                    ],
                    'Tali' => [
                        'Tali Original' => [
                            ['name' => 'Tali1', 'price' => 0, 'texture_code' => ''],
                        ],
                    ],
                    'Tali Kunci' => [
                        'Tali Kunci Original' => [
                            ['name' => 'Talikunci1', 'price' => 0, 'texture_code' => ''],
                        ],
                    ],

                ]
            ],

        ];

        foreach ($productsData as $data) {
            $product = Product::where('name', $data['product_name'])->first();

            if (!$product) {
                $this->command->error("Gagal: Produk '{$data['product_name']}' tidak ditemukan! Lewati.");
                continue;
            }

            $this->command->info("\nMemproses tekstur untuk produk: {$product->name}");
            
            $sourcePath = database_path("seeders/{$data['dummy_folder']}/textures"); 
            foreach ($data['texturesMapping'] as $partName => $variants) {
                $part = ProductParts::where('product_id', $product->id)
                                    ->where('name', $partName)
                                    ->first();

                if ($part) {
                    foreach ($variants as $variantName => $textures) {
                        $variant = PartVariants::where('part_id', $part->id)
                                               ->where('name', $variantName)
                                               ->first();

                        if ($variant) {
                            foreach ($textures as $textureData) {
                                $textureName = $textureData['name'];
                                $slugTexture = Str::slug($textureName); 
                                $slugPart = Str::slug($partName); 
                                $texture = PartTextures::create([
                                    'product_id'   => $product->id,
                                    'part_id'      => $part->id,
                                    'variant_id'   => $variant->id,
                                    'name'         => $textureName,
                                    'price'        => $textureData['price'],
                                    'texture_code' => $textureData['texture_code'],
                                ]);

                                $folderPath = "products/{$product->id}/parts/{$part->id}/{$variant->id}/{$texture->id}";
                                if (!Storage::disk('public')->exists($folderPath)) {
                                    Storage::disk('public')->makeDirectory($folderPath);
                                }
                                $fileNames = [
                                    'img_top'   => "top-{$slugTexture}.webp",
                                    'img_back'  => "back-{$slugTexture}.webp",
                                    'img_front' => "front-{$slugTexture}.webp",
                                    'img_thumb' => "thumb-{$slugTexture}.webp",
                                ];

                                $updateData = [];
                                foreach ($fileNames as $column => $fileName) {
                                    $sourceFile = "{$sourcePath}/{$slugPart}/{$fileName}";

                                    if (File::exists($sourceFile)) {
                                        $destinationPath = "{$folderPath}/{$fileName}";
                                        Storage::disk('public')->put($destinationPath, File::get($sourceFile));
                                        $updateData[$column] = $destinationPath;
                                    } else {
                                        $this->command->warn(" - Gambar tidak ditemukan: {$sourceFile}");
                                    }
                                }

                                if (!empty($updateData)) {
                                    $texture->update($updateData);
                                }

                                $this->command->info(" + Texture '{$textureName}' (Part: {$partName}) berhasil ditambahkan.");
                            }
                        } else {
                            $this->command->warn(" [!] Varian '{$variantName}' tidak ditemukan untuk part '{$partName}'.");
                        }
                    }
                } else {
                    $this->command->warn(" [!] Part '{$partName}' tidak ditemukan.");
                }
            }
        }

        $this->command->info("\n==== SEMUA PROSES SEEDING TEXTURE SELESAI ====");
    }
}