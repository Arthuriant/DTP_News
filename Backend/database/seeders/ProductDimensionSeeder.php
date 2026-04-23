<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;          // ← ini yang kurang
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
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if (!$product) {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
            return;
        }

        $sourcePath = database_path('seeders/Product_Dummy/dimension');

        // Cek folder dummy ada tidak
        if (!File::exists($sourcePath)) {
            $this->command->error("Folder dimension tidak ditemukan di: {$sourcePath}");
            return;
        }

        // Ambil file gambar dari folder dummy
        $files = File::files($sourcePath);

        if (empty($files)) {
            $this->command->warn('Tidak ada file gambar di folder dimension!');
            return;
        }

        // Folder tujuan di storage
        $folderPath = "products/{$product->id}/dimension";

        // Buat folder kalau belum ada
        if (!Storage::disk('public')->exists($folderPath)) {
            Storage::disk('public')->makeDirectory($folderPath);
        }

        // Ambil file pertama (dimension.png)
        $file = $files[0];
        $fileName = $file->getFilename();
        $destinationPath = "{$folderPath}/{$fileName}";

        // Salin file ke storage
        Storage::disk('public')->put($destinationPath, File::get($file->getPathname()));

        $this->command->info("Berhasil: Gambar dimensi '{$fileName}' disalin ke storage.");

        // Simpan ke database (updateOrCreate karena product_id adalah primary key)
        ProductDimensions::updateOrCreate(
            ['product_id' => $product->id],
            [
                'product_style' => 'Tas Mini',
                'total_volumes' => 16,  // 16 liter
                'weight'        => 2,   // 2 lbs (integer sesuai kolom migration)
                'img'           => $destinationPath,
            ]
        );

        $this->command->info('==== SEEDING DIMENSION SELESAI ====');
    }
}
