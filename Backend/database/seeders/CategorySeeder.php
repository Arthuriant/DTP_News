<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categories;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Tas Pria',
                'description' => 'Koleksi tas kulit premium khusus pria dengan desain maskulin dan fungsional.',
            ],
        ];

        foreach ($categories as $category) {
            Categories::create($category);
        }
    }
}