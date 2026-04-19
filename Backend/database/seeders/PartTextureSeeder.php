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

        if ($product) {
            $part = ProductParts::where('product_id', $product->id)
                                ->where('name', 'Badan Tas Kiri')
                                ->first();

            if ($part) {
                $variant = PartVariants::where('part_id', $part->id)
                                       ->where('name', 'Tubuh Tas Original')
                                       ->first();

                if ($variant) {
                    $textureName = 'Eco Cordura Canvas';
                    $slugName = Str::slug($textureName); 
                    $texture = PartTextures::create([
                        'product_id' => $product->id,
                        'part_id'    => $part->id,
                        'variant_id' => $variant->id,
                        'name'       => $textureName,
                        'price'      => 0,
                    ]);

                    $folderPath = "products/{$product->id}/parts/{$part->id}/{$variant->id}/{$texture->id}";

                    if (!Storage::disk('public')->exists($folderPath)) {
                        Storage::disk('public')->makeDirectory($folderPath);
                    }

                    $fileNames = [
                        'img_top'   => "top-{$slugName}.webp",
                        'img_back'  => "back-{$slugName}.webp",
                        'img_front' => "front-{$slugName}.webp",
                        'img_thumb' => "thumb-{$slugName}.webp",
                    ];

                    // 4. Proses pemindahan file dari folder dummy (Database/seeders/Product_Dummy/...)

                    $sourcePath = database_path('seeders/Product_Dummy/Textures');
                    
                    $updateData = [];
                    foreach ($fileNames as $column => $fileName) {
                        $sourceFile = "{$sourcePath}/{$fileName}";
                        if (File::exists($sourceFile)) {
                            $destinationPath = "{$folderPath}/{$fileName}";
                            Storage::disk('public')->put($destinationPath, File::get($sourceFile));
                            
                            // Simpan path relatif untuk database
                            $updateData[$column] = $destinationPath;
                        } else {
                            $this->command->warn("File dummy tidak ditemukan: {$sourceFile}");
                        }
                    }

                    // 5. Update data texture dengan path gambar yang benar
                    $texture->update($updateData);

                    $this->command->info("Data Part Texture ({$textureName}) dan folder berhasil dibuat!");
                    
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