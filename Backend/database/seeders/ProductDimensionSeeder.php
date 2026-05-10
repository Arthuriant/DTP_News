<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;          
use App\Models\ProductDimensions;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProductDimensionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productsData = [
            [
                'product_name'  => 'Classic Messenger Bag',
                'dummy_folder'  => 'Product_Dummy',
                'product_style' => 'Tas Mini',
                'total_volumes' => 16,  
                'weight'        => 2,  
            ],
            [
                'product_name'  => 'Classic Top Handle Bag', 
                'dummy_folder'  => 'Product_Dummy_2',
                'product_style' => 'Tas Tangan',
                'total_volumes' => 20,         
                'weight'        => 3,          
            ],
            
        ];

        foreach ($productsData as $data) {
            $product = Product::where('name', $data['product_name'])->first();

            if (!$product) {
                $this->command->error("Gagal: Produk '{$data['product_name']}' tidak ditemukan! Lewati.");
                continue;
            }

            $this->command->info("\nMemproses dimensi untuk produk: {$product->name}");

            $sourcePath = database_path("seeders/{$data['dummy_folder']}/dimension");

            if (!File::exists($sourcePath)) {
                $this->command->warn(" - Folder dimension tidak ditemukan di: {$sourcePath}");
                continue;
            }

            $files = File::files($sourcePath);

            if (empty($files)) {
                $this->command->warn(" - Tidak ada file gambar di folder dimension untuk produk {$product->name}!");
                continue;
            }

            $folderPath = "products/{$product->id}/dimension";

            if (!Storage::disk('public')->exists($folderPath)) {
                Storage::disk('public')->makeDirectory($folderPath);
            }

            $file = $files[0];
            $fileName = $file->getFilename();
            $destinationPath = "{$folderPath}/{$fileName}";

            Storage::disk('public')->put($destinationPath, File::get($file->getPathname()));

            $this->command->info(" + Berhasil: Gambar dimensi '{$fileName}' disalin ke storage.");

            ProductDimensions::updateOrCreate(
                ['product_id' => $product->id],
                [
                    'product_style' => $data['product_style'],
                    'total_volumes' => $data['total_volumes'],
                    'weight'        => $data['weight'],
                    'img'           => $destinationPath,
                ]
            );
        }

        $this->command->info("\n==== SEMUA PROSES SEEDING DIMENSION SELESAI ====");
    }
}