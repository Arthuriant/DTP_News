<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');

            // Cukup pakai string karena ID dari frontend-mu berupa teks (misal: "tas_kelalawar")
            $table->string('product_id');

            // Simpan harga akhir hasil kustomisasi
            $table->integer('price');

            // Simpan semua pilihan warna, bahan, dan ukuran di dalam satu kolom JSON
            $table->json('customizations')->nullable();

            $table->integer('quantity')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
