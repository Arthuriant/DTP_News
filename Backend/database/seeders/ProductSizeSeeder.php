<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductSizes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ProductSizeSeeder extends Seeder
{
    public function run(): void
    {
        $productsData = [
            [
                'product_name' => 'Classic Messenger Bag',
                'dummy_folder' => 'Product_Dummy',
                'sizes' => [
                    [
                        'title'       => 'Kompak (S)',
                        'short_desc'  => 'Gaya Kasual Ringkas',
                        'description' => 'Versi mungil dari desain ikonik kami. Sempurna untuk jalan santai, pas untuk menyimpan satu smartphone, dompet kartu, dan kunci mobil tanpa kehilangan gaya color-block yang khas.',
                        'price'       => 0,
                        'width'       => 20,
                        'height'      => 14,
                        'depth'       => 8,
                        'unit'        => 'cm',
                        'img_file'    => 'small.webp',
                    ],
                    [
                        'title'       => 'Standar (M)',
                        'short_desc'  => 'Esensial Sehari-hari',
                        'description' => 'Ukuran paling ideal dan proporsional. Sesuai dengan desain interior yang luas, ukuran ini dengan mudah memuat dua smartphone, buku catatan kecil, pena, dan dompet harian Anda.',
                        'price'       => 150000,
                        'width'       => 25,
                        'height'      => 18,
                        'depth'       => 10,
                        'unit'        => 'cm',
                        'img_file'    => 'medium.webp',
                    ],
                    [
                        'title'       => 'Besar (L)',
                        'short_desc'  => 'Kapasitas Ekstra',
                        'description' => 'Ruang lebih leluasa untuk mobilitas tinggi. Sanggup memuat tablet (seperti iPad), buku agenda, serta membawa semua perlengkapan esensial harian Anda dengan tetap mempertahankan struktur minimalisnya.',
                        'price'       => 350000,
                        'width'       => 30,
                        'height'      => 22,
                        'depth'       => 12,
                        'unit'        => 'cm',
                        'img_file'    => 'large.webp',
                    ],
                    [
                        'title'       => 'Maksimal (XL)',
                        'short_desc'  => 'Profesional & Modern',
                        'description' => 'Varian terbesar yang cocok untuk bekerja atau kuliah. Memiliki ruang ekstra untuk membawa dokumen, buku berukuran A4, atau laptop tipis 13 inci dengan gaya retro yang berani.',
                        'price'       => 550000,
                        'width'       => 35,
                        'height'      => 25,
                        'depth'       => 14,
                        'unit'        => 'cm',
                        'img_file'    => 'xlarge.webp',
                    ],
                ]
            ],

            [
                'product_name' => 'Classic Top Handle Bag', 
                'dummy_folder' => 'Product_Dummy_2',
                'sizes' => [
                    [
                        'title'       => 'Standar (M)',
                        'short_desc'  => 'Elegan & Proporsional',
                        'description' => 'Ukuran sempurna untuk menemani acara formal maupun kasual Anda.',
                        'price'       => 0,
                        'width'       => 22,
                        'height'      => 16,
                        'depth'       => 9,
                        'unit'        => 'cm',
                        'img_file'    => 'medium.webp', 
                    ],
                    [
                        'title'       => 'Besar (L)',
                        'short_desc'  => 'Kapasitas Ekstra',
                        'description' => 'Ruang lebih leluasa untuk Anda yang membutuhkan lebih banyak bawaan harian.',
                        'price'       => 200000,
                        'width'       => 28,
                        'height'      => 20,
                        'depth'       => 11,
                        'unit'        => 'cm',
                        'img_file'    => 'large.webp', 
                    ],
                    [
                        'title'       => 'Kompak (S)',
                        'short_desc'  => 'Gaya Elegan Ringkas',
                        'description' => 'Versi mungil dari desain ikonik kami. Sempurna untuk jalan santai, pas untuk menyimpan satu smartphone, dompet kartu, dan kunci mobil tanpa kehilangan gaya color-block yang khas.',
                        'price'       => 0,
                        'width'       => 20,
                        'height'      => 14,
                        'depth'       => 8,
                        'unit'        => 'cm',
                        'img_file'    => 'small.webp',
                    ],
                    [
                        'title'       => 'Maksimal (XL)',
                        'short_desc'  => 'Profesional & Elegan',
                        'description' => 'Varian terbesar yang cocok untuk bekerja atau kuliah. Memiliki ruang ekstra untuk membawa dokumen, buku berukuran A4, atau laptop tipis 13 inci dengan gaya retro yang berani.',
                        'price'       => 550000,
                        'width'       => 35,
                        'height'      => 25,
                        'depth'       => 14,
                        'unit'        => 'cm',
                        'img_file'    => 'xlarge.webp',
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

            $this->command->info("\nMemproses ukuran (size guide) untuk produk: {$product->name}");

            $sourcePath = database_path("seeders/{$data['dummy_folder']}/size-guide");
            $folderPath = "products/{$product->id}/size-guide";

            if (!Storage::disk('public')->exists($folderPath)) {
                Storage::disk('public')->makeDirectory($folderPath);
            }

            foreach ($data['sizes'] as $size) {
                $sourceFile = "{$sourcePath}/{$size['img_file']}";
                $destinationPath = "{$folderPath}/{$size['img_file']}";
                $imgPath = null;

                if (File::exists($sourceFile)) {
                    Storage::disk('public')->put($destinationPath, File::get($sourceFile));
                    $imgPath = $destinationPath;
                } else {
                    $this->command->warn(" [!] Gambar ukuran tidak ditemukan: {$sourceFile}");
                }

                ProductSizes::create([
                    'product_id'  => $product->id,
                    'title'       => $size['title'],
                    'short_desc'  => $size['short_desc'],
                    'description' => $size['description'],
                    'price'       => $size['price'],
                    'width'       => $size['width'],
                    'height'      => $size['height'],
                    'depth'       => $size['depth'],
                    'unit'        => $size['unit'],
                    'img'         => $imgPath,
                ]);

                $this->command->info(" + Size '{$size['title']}' berhasil ditambahkan.");
            }
        }

        $this->command->info("\n==== SEMUA PROSES SEEDING SIZE SELESAI ====");
    }
}