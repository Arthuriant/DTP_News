<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductParts;
use App\Models\Product; 
use Illuminate\Support\Facades\Storage; 

class ProductPartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::where('name', 'Classic Messenger Bag')->first();

        if ($product) {
            
            $partsData = [
                [
                    'product_id' => $product->id, 
                    'name'       => 'Badan Tas Kiri',
                    'part_code'  => 'PRT-BADAN-TAS-KIRI',
                    'z_index'    => [
                        'Front' => 20,
                        'Back'  => 10,
                        'Top'   => 10,
                    ],
                ],
                [
                    'product_id' => $product->id, 
                    'name'       => 'Badan Tas Tengah',
                    'part_code'  => 'PRT-BADAN-TAS-TENGAH',
                    'z_index'    => [
                        'Front' => 30,
                        'Back'  => 20,
                        'Top'   => 20,
                    ],
                ],
                [
                    'product_id' => $product->id, 
                    'name'       => 'Badan Tas Kanan',
                    'part_code'  => 'PRT-BADAN-TAS-KANAN',
                    'z_index'    => [
                        'Front' => 20,
                        'Back'  => 10,
                        'Top'   => 10,
                    ],
                ],
                [
                    'product_id' => $product->id, 
                    'name'       => 'Tali',
                    'part_code'  => 'PRT-TALI',
                    'z_index'    => [
                        'Front' => 10,
                        'Back'  => 30,
                        'Top'   => 20,
                    ],
                ],
                [
                    'product_id' => $product->id, 
                    'name'       => 'Kunci',
                    'part_code'  => 'PRT-KUNCI',
                    'z_index'    => [
                        'Front' => 40,
                        'Back'  => 10,
                        'Top'   => 20,
                    ],
                ],
            ];

            foreach ($partsData as $data) {
                $part = ProductParts::create($data);

                $folderPath = 'products/' . $product->id . '/parts/' . $part->id;

                if (!Storage::disk('public')->exists($folderPath)) {
                    Storage::disk('public')->makeDirectory($folderPath);
                }

                $this->command->info('Data & Folder untuk Part "' . $data['name'] . '" berhasil dibuat!');
            }

            $this->command->info('==== SEMUA PRODUCT PARTS BERHASIL DITAMBAHKAN ====');
            
        } else {
            $this->command->error('Gagal: Produk "Classic Messenger Bag" tidak ditemukan! Pastikan ProductSeeder dijalankan lebih dulu.');
        }
    }
}