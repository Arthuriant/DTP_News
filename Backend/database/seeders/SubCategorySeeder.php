<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categories;
use App\Models\SubCategories;

class SubCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Data di-mapping berdasarkan nama Kategori Induknya
        $subCategories = [
            'Tas Pria' => [
                ['name' => 'Messenger Bag', 'description' => 'Tas selempang klasik yang cocok untuk kerja.'],
                ['name' => 'Backpack', 'description' => 'Ransel kulit tangguh untuk mobilitas tinggi.'],
                ['name' => 'Briefcase', 'description' => 'Tas kerja formal untuk tampilan profesional.'],
            ],
        ];

        foreach ($subCategories as $categoryName => $subs) {
            $parentCategory = Categories::where('name', $categoryName)->first();

            if ($parentCategory) {
                foreach ($subs as $sub) {
                    SubCategories::create([
                        'categories_id' => $parentCategory->id, // Menggunakan UUID hasil query
                        'name' => $sub['name'],
                        'description' => $sub['description'],
                    ]);
                }
            }
        }
    }
}