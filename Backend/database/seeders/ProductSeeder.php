<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\SubCategories;
use Illuminate\Support\Facades\Storage; // 👈 Import ini
use Illuminate\Support\Facades\File;    // 👈 Import ini

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $subCategory = SubCategories::where('name', 'Messenger Bag')->first();
        
        if ($subCategory) {
            $product = Product::create([
                'sub_categories_id' => $subCategory->id, 
                'name' => 'Classic Messenger Bag',
                'summary' => 'Tas selempang kulit premium...',
                'description' => 'Hadirkan kesan elegan dalam setiap langkah Anda...',
                'base_price' => 650000,
                'is_active' => true,
            ]);
        
            $sourceImage = database_path('seeders/Product_Dummy/Cover/cover.webp'); 

            if (File::exists($sourceImage)) {
                

                $destinationFolder = 'products/' . $product->id . '/Cover';
                $destinationFile = $destinationFolder . '/cover.webp';

                if (!Storage::disk('public')->exists($destinationFolder)) {
                    Storage::disk('public')->makeDirectory($destinationFolder);
                }

                Storage::disk('public')->put($destinationFile, File::get($sourceImage));

                $product->update([
                    'img' => $destinationFile 
                ]);

                $this->command->info('Gambar cover berhasil disalin!');
            } else {
                $this->command->warn('Produk dibuat, tapi gambar dummy tidak ditemukan di: ' . $sourceImage);
            }

            $this->command->info('Produk Classic Messenger Bag berhasil ditambahkan!');
        } else {
            $this->command->error('Gagal: Sub Kategori "Messenger Bag" tidak ditemukan!');
        }
    }
}