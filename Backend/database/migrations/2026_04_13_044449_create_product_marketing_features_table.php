<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::create('product_marketing_features', function (Blueprint $table) {
            // Mengoreksi typo di ERD: Baris pertama dijadikan 'id' sebagai Primary Key
            $table->string('id', 50)->primary();

            // Foreign Keys
            $table->string('product_id', 50);
            $table->string('block_id', 50);

            $table->string('title', 25);
            $table->timestamps(); // Otomatis membuat created_at dan updated_at TIMESTAMP

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            // Relasi ke tabel product_marketing_blocks yang baru saja kita buat sebelumnya
            $table->foreign('block_id')->references('id')->on('product_marketing_blocks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_marketing_features');
    }
};
