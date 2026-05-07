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
        $productsWithParts = [
            [
                'product_name' => 'Classic Messenger Bag',
                'parts' => [
                    [
                        'name'      => 'Badan Tas Kiri',
                        'part_code' => 'PRT-BADAN-TAS-KIRI',
                        'z_index'   => ['Front' => 20, 'Back'  => 10, 'Top'   => 10],
                    ],
                    [
                        'name'      => 'Badan Tas Tengah',
                        'part_code' => 'PRT-BADAN-TAS-TENGAH',
                        'z_index'   => ['Front' => 30, 'Back'  => 20, 'Top'   => 20],
                    ],
                    [
                        'name'      => 'Badan Tas Kanan',
                        'part_code' => 'PRT-BADAN-TAS-KANAN',
                        'z_index'   => ['Front' => 20, 'Back'  => 10, 'Top'   => 10],
                    ],
                    [
                        'name'      => 'Tali',
                        'part_code' => 'PRT-TALI',
                        'z_index'   => ['Front' => 10, 'Back'  => 30, 'Top'   => 20],
                    ],
                    [
                        'name'      => 'Kunci',
                        'part_code' => 'PRT-KUNCI',
                        'z_index'   => ['Front' => 40, 'Back'  => 10, 'Top'   => 20],
                    ],
                ]
            ],
            
            [
                'product_name' => 'Classic Top Handle Bag', 
                'parts' => [
                    [
                        'name'      => 'Badan',
                        'part_code' => 'PRT-BADAN',
                        'z_index'   => ['Front' => 10, 'Back'  => 20, 'Top'   => 10],
                    ],
                    [
                        'name'      => 'Kunci',
                        'part_code' => 'PRT-KUNCI',
                        'z_index'   => ['Front' => 60, 'Back'  => 60, 'Top'   => 60],
                    ],
                    [
                        'name'      => 'Lidah Kanan',
                        'part_code' => 'PRT-LIDAH-KANAN',
                        'z_index'   => ['Front' => 30, 'Back'  => 30, 'Top'   => 30],
                    ],
                    [
                        'name'      => 'Lidah Kiri',
                        'part_code' => 'PRT-LIDAH-KIRI',
                        'z_index'   => ['Front' => 30, 'Back'  => 30, 'Top'   => 30],
                    ],
                    [
                        'name'      => 'Lidah Tengah',
                        'part_code' => 'PRT-LIDAH-TENGAH',
                        'z_index'   => ['Front' => 40, 'Back'  => 40, 'Top'   => 40],
                    ],
                    [
                        'name'      => 'Pita',
                        'part_code' => 'PRT-PITA',
                        'z_index'   => ['Front' => 20, 'Back'  => 20, 'Top'   => 60],
                    ],
                    [
                        'name'      => 'Tali',
                        'part_code' => 'PRT-TALI',
                        'z_index'   => ['Front' => 20, 'Back'  => 70, 'Top'   => 70],
                    ],
                    [
                        'name'      => 'Tali Kunci',
                        'part_code' => 'PRT-TALI-KUNCI',
                        'z_index'   => ['Front' => 50, 'Back'  => 50, 'Top'   => 50],
                    ],
                ]
            ],
        ];

        foreach ($productsWithParts as $data) {
            $product = Product::where('name', $data['product_name'])->first();

            if ($product) {
                $this->command->info('Memproses parts untuk produk: ' . $product->name);

                foreach ($data['parts'] as $partData) {
                    
                    $partData['product_id'] = $product->id;
                    $part = ProductParts::create($partData);
                    $folderPath = 'products/' . $product->id . '/parts/' . $part->id;
                    if (!Storage::disk('public')->exists($folderPath)) {
                        Storage::disk('public')->makeDirectory($folderPath);
                    }

                    $this->command->info(' - Data & Folder part "' . $partData['name'] . '" berhasil dibuat!');
                }
            } else {
                $this->command->warn('Dilewati: Produk "' . $data['product_name'] . '" tidak ditemukan di database.');
            }
        }

        $this->command->info('==== SEMUA PRODUCT PARTS SELESAI DIPROSES ====');
    }
}