<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductSizes;

class ProductSizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            $sizes = [
                [
                    'title'       => 'Kompak (S)',
                    'short_desc'  => 'Gaya Kasual Ringkas',
                    'description' => 'Versi mungil dari desain ikonik kami. Sempurna untuk jalan santai, pas untuk menyimpan satu smartphone, dompet kartu, dan kunci mobil tanpa kehilangan gaya color-block yang khas.',
                    'price'       => 0,
                    'width'       => 20,
                    'height'      => 14,
                    'depth'       => 8,
                    'unit'        => 'cm',
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
                ],
            ];

            foreach ($sizes as $size) {
                ProductSizes::create([
                    'product_id'  => $product->id, // Ambil UUID produk secara dinamis
                    'title'       => $size['title'],
                    'short_desc'  => $size['short_desc'],
                    'description' => $size['description'],
                    'price'       => $size['price'],
                    'width'       => $size['width'],
                    'height'      => $size['height'],
                    'depth'       => $size['depth'],
                    'unit'        => $size['unit'],
                ]);
            }

            $this->command->info('4 Data Product Sizes (S, M, L, XL) berhasil ditambahkan untuk Classic Messenger Bag!');
            
        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan!');
        }
    }
}