<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            // 1. Primary Key UUID
            $table->uuid('id')->primary();

            // 2. Relasi ke tabel orders (UUID)
            $table->uuid('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');

            // 3. Relasi ke tabel products (UUID)
            $table->uuid('product_id');
            // Catatan: Jika product_id tidak di-cascade, jika produk dihapus, riwayat struk belanja tidak akan rusak.
            // Tapi untuk amannya sekarang, kita biarkan tanpa foreign constraint ketat dulu sampai tabel products dibuat.

            // 4. Data Transaksional Kustomisasi
            $table->integer('qty');
            $table->decimal('price', 15, 2); // Harga per item (presisi tinggi)

            // 5. State Kustomisasi (SANGAT PENTING!)
            // Di sinilah hasil desain 3D user dari cart_items dipindahkan secara permanen saat checkout
            $table->jsonb('custom_configuration')->nullable(); 

            // 6. Audit Trail
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};