<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            RoleSeeder::class, // Wajib jalan duluan untuk membuat pangkat
            UserSeeder::class, // Baru jalan ini untuk membuat user & memberi pangkat
            CategorySeeder::class, // Wajib jalan duluan untuk membuat kategori
            SubCategorySeeder::class, // Baru jalan ini untuk membuat sub kategori yang butuh referensi kategori
            ProductSeeder::class, // Baru jalan ini untuk membuat produk yang butuh referensi sub kategori
            ProductPartSeeder::class,
            PartVariantSeeder::class, // Baru jalan ini untuk membuat varian yang butuh refer
            PartTextureSeeder::class, // Baru jalan ini untuk membuat texture yang butuh referensi produk, part, dan varian
            ProductGallerySeeder::class,
            // ProductGallerySeeder::class, // Baru jalan ini untuk membuat galeri yang butuh referensi produk
        ]);
    }
}
