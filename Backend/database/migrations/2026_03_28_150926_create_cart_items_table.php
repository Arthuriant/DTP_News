<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            // 1. Primary Key
            $table->uuid('id')->primary();
            
            // 2. Foreign Key ke tabel carts
            $table->uuid('cart_id');
            $table->foreign('cart_id')->references('id')->on('carts')->onDelete('cascade');

            // 3. Foreign Key ke tabel products (Sesuai ERD: VARCHAR(50))
            // Asumsinya nanti tabel products juga pakai UUID. Jika pakai ID string biasa, biarkan string('product_id', 50)
            $table->uuid('product_id'); 

            // 4. Data Transaksional Kustomisasi
            $table->integer('qty')->default(1); // Sesuai ERD namanya 'qty'
            $table->bigInteger('price'); // Harga setelah dihitung dengan bahan kustom

            // 5. State Kustomisasi (Menggunakan jsonb karena PostgreSQL)
            
            // Ini yang akan menyimpan: {"body": "Red Leather", "strap": "Black Canvas"}
            
            $table->jsonb('custom_configuration')->nullable(); 

            // 6. Audit Trail (Sesuai ERD)
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};