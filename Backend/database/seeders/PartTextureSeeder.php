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
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if (!$product) {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
            return;
        }

        $texturesMapping = [
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
        ];

        $sourcePath = database_path('seeders/Product_Dummy/Textures');

        foreach ($texturesMapping as $partName => $variants) {
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
                            $slugTexture = Str::slug($textureName); // eco-cordura-canvas
                            
                            // 👈 TAMBAHKAN INI: Buat slug dari nama Part (badan-tas-kiri)
                            $slugPart = Str::slug($partName); 

                            $texture = PartTextures::create([
                                'product_id' => $product->id,
                                'part_id'    => $part->id,
                                'variant_id' => $variant->id,
                                'name'       => $textureName,
                                'price'      => $textureData['price'],
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
                                // 👈 UBAH PATH INI: Tambahkan folder slugPart
                                $sourceFile = "{$sourcePath}/{$slugPart}/{$fileName}";

                                if (File::exists($sourceFile)) {
                                    $destinationPath = "{$folderPath}/{$fileName}";
                                    Storage::disk('public')->put($destinationPath, File::get($sourceFile));
                                    $updateData[$column] = $destinationPath;
                                } else {
                                    $this->command->warn("Gambar tidak ditemukan: {$sourceFile}");
                                }
                            }

                            if (!empty($updateData)) {
                                $texture->update($updateData);
                            }

                            $this->command->info("Berhasil: Texture '{$textureName}' untuk Part '{$partName}' ditambahkan.");
                        }
                    } else {
                        $this->command->warn("Lewati: Varian '{$variantName}' tidak ditemukan untuk part '{$partName}'.");
                    }
                }
            } else {
                $this->command->warn("Lewati: Part '{$partName}' tidak ditemukan.");
            }
        }

        $this->command->info('==== SEMUA PROSES SEEDING TEXTURE SELESAI ====');
    }
}