<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductGalleries;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProductGallerySeeder extends Seeder
{
    public function run(): void
    {
        $productsData = [
            [
                'product_name' => 'Classic Messenger Bag',
                'dummy_folder' => 'Product_Dummy', 
            ],
            [
                'product_name' => 'Classic Top Handle Bag', 
                'dummy_folder' => 'Product_Dummy_2',     
            ],
        ];

        foreach ($productsData as $data) {
            $product = Product::where('name', $data['product_name'])->first();

            if (!$product) {
                $this->command->error("Gagal: Produk '{$data['product_name']}' tidak ditemukan di database! Lewati.");
                continue; 
            }

            $this->command->info("\nMemproses gallery untuk produk: {$product->name}");

            $sourcePath = database_path("seeders/{$data['dummy_folder']}/gallery");

            if (!File::exists($sourcePath)) {
                $this->command->warn(" - Folder gallery tidak ditemukan di: {$sourcePath}");
                continue;
            }

            $files = File::files($sourcePath);

            if (empty($files)) {
                $this->command->warn(" - Tidak ada file gambar di folder gallery untuk {$product->name}!");
                continue;
            }

            $folderPath = "products/{$product->id}/gallery";

            if (!Storage::disk('public')->exists($folderPath)) {
                Storage::disk('public')->makeDirectory($folderPath);
            }

            foreach ($files as $index => $file) {
                $fileName = $file->getFilename(); // misal: gallery-1.webp, gallery-2.webp
                $destinationPath = "{$folderPath}/{$fileName}";

                // Salin file ke storage
                Storage::disk('public')->put($destinationPath, File::get($file->getPathname()));

                // Simpan ke database
                ProductGalleries::create([
                    'product_id' => $product->id,
                    'img'        => $destinationPath,
                    'sort_order' => $index + 1,
                ]);

                $this->command->info(" + Berhasil: Gallery '{$fileName}' ditambahkan (urutan " . ($index + 1) . ").");
            }
        }

        $this->command->info("\n==== SEMUA PROSES SEEDING GALLERY SELESAI ====");
    }
}