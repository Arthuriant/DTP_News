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
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if (!$product) {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
            return;
        }

        $sourcePath = database_path('seeders/Product_Dummy/gallery');

        // Cek folder dummy ada tidak
        if (!File::exists($sourcePath)) {
            $this->command->error("Folder gallery tidak ditemukan di: {$sourcePath}");
            return;
        }

        // Ambil semua file gambar dari folder dummy
        $files = File::files($sourcePath);

        if (empty($files)) {
            $this->command->warn('Tidak ada file gambar di folder gallery!');
            return;
        }

        // Folder tujuan di storage
        $folderPath = "products/{$product->id}/gallery";

        // Buat folder kalau belum ada
        if (!Storage::disk('public')->exists($folderPath)) {
            Storage::disk('public')->makeDirectory($folderPath);
        }

        foreach ($files as $index => $file) {
            $fileName = $file->getFilename(); // gallery-1.webp, gallery-2.webp, dst
            $destinationPath = "{$folderPath}/{$fileName}";

            // Salin file ke storage
            Storage::disk('public')->put($destinationPath, File::get($file->getPathname()));

            // Simpan ke database
            ProductGalleries::create([
                'product_id' => $product->id,
                'img'        => $destinationPath,
                'sort_order' => $index + 1,
            ]);

            $this->command->info("Berhasil: Gallery '{$fileName}' ditambahkan (urutan " . ($index + 1) . ").");
        }

        $this->command->info('==== SEEDING GALLERY SELESAI ====');
    }
}
