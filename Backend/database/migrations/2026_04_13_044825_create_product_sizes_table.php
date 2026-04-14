<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_sizes', function (Blueprint $table) {
            // 1. Ubah jadi UUID
            $table->uuid('id')->primary();

            // 2. Foreign Key wajib UUID
            $table->uuid('product_id');

            // Data Kolom
            $table->string('title', 25);
            $table->string('short_desc', 100)->nullable();
            $table->text('description')->nullable();

            // 3. Kita ikuti saran cerdas untuk menyamakan dengan tabel lain (Desimal)
            $table->decimal('price', 12, 2)->default(0);

            // Dimensi
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('depth')->nullable();
            $table->string('unit', 10)->nullable(); // 'cm', 'mm', 'inch'

            $table->timestamps(); 

            // Relasi
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sizes');
    }
};