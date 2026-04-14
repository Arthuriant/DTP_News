<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\SubCategories;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subCategory = SubCategories::where('name', 'Messenger Bag')->first();
        if ($subCategory) {
            Product::create([
                'sub_categories_id' => $subCategory->id, 
                'name' => 'Classic Messenger Bag',
                'summary' => 'Tas selempang kulit premium bergaya retro-modern untuk menunjang mobilitas dan gaya profesional Anda',
                'description' => 'Hadirkan kesan elegan dalam setiap langkah Anda dengan Classic Messenger Bag. Dirancang dari material kulit berkualitas tinggi yang tahan lama, tas ini menawarkan perpaduan sempurna antara gaya warisan klasik dan fungsionalitas masa kini. Dilengkapi dengan kompartemen utama yang luas untuk menyimpan gadget dan dokumen, saku organizer cerdas di bagian dalam, serta tali bahu ergonomis yang nyaman digunakan seharian penuh. Pilihan ideal untuk menemani rutinitas kerja, kuliah, maupun aktivitas kasual akhir pekan Anda dengan penuh gaya.',
                'base_price' => 650000,
                'is_active' => true,
            ]);
            
            $this->command->info('Produk Classic Messenger Bag berhasil ditambahkan!');
        } else {
            $this->command->error('Gagal: Sub Kategori "Messenger Bag" tidak ditemukan!');
        }
    }
}