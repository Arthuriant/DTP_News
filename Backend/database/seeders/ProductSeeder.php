<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\SubCategories;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Siapkan data produk dalam bentuk Array
        $productsData = [
            [
                'subcategory_name' => 'Messenger Bag', 
                'name'             => 'Classic Messenger Bag',
                'summary'          => 'Tas selempang kulit premium...',
                'description'      => 'Hadirkan kesan elegan dalam setiap langkah Anda...',
                'base_price'       => 650000,
                'dummy_folder'     => 'Product_Dummy' 
            ],
            [
                'subcategory_name' => 'Top Handle Bag', 
                'name'             => 'Classic Top Handle Bag',
                'summary'          => 'Tas kasual untuk keseharian Anda...',
                'description'      => 'Didesain khusus untuk mobilitas tinggi dengan kompartemen luas...',
                'base_price'       => 850000,
                'dummy_folder'     => 'Product_Dummy_2'
            ]
        ];

        // 2. Lakukan looping untuk setiap data produk
        foreach ($productsData as $data) {
            $subCategory = SubCategories::where('name', $data['subcategory_name'])->first();
            
            if ($subCategory) {
                $product = Product::create([
                    'sub_categories_id' => $subCategory->id, 
                    'name'              => $data['name'],
                    'summary'           => $data['summary'],
                    'description'       => $data['description'],
                    'base_price'        => $data['base_price'],
                    'is_active'         => true,
                ]);
            
                $sourceImage = database_path('seeders/' . $data['dummy_folder'] . '/Cover/cover.webp'); 

                if (File::exists($sourceImage)) {
                    $destinationFolder = 'products/' . $product->id . '/Cover';
                    $destinationFile = $destinationFolder . '/cover.webp';

                    if (!Storage::disk('public')->exists($destinationFolder)) {
                        Storage::disk('public')->makeDirectory($destinationFolder);
                    }

                    // Kopi gambar dari seeder ke storage public
                    Storage::disk('public')->put($destinationFile, File::get($sourceImage));

                    // Update path gambar di database
                    $product->update([
                        'img' => $destinationFile 
                    ]);

                    $this->command->info('Gambar cover ' . $data['name'] . ' berhasil disalin!');
                } else {
                    $this->command->warn('Produk dibuat, tapi gambar dummy tidak ditemukan di: ' . $sourceImage);
                }

                $this->command->info('Produk ' . $data['name'] . ' berhasil ditambahkan!');
            } else {
                $this->command->error('Gagal: Sub Kategori "' . $data['subcategory_name'] . '" tidak ditemukan untuk produk ' . $data['name'] . '!');
            }
        }
    }
}