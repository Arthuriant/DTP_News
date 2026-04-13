<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_galleries', function (Blueprint $table) {
            $table->uuid('id')->primary();       // 👈 Ubah jadi UUID
            $table->uuid('product_id');          // 👈 Foreign Key wajib UUID
            
            // 👇 INI YANG TERLEWAT: Kolom untuk menyimpan nama file / link gambar
            $table->text('image_url'); 
            
            $table->integer('sort_order')->default(0); 
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_galleries');
    }
};