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
        Schema::create('product_sizes', function (Blueprint $table) {
            // Primary Key
            $table->string('id', 50)->primary();

            // Foreign Key
            $table->string('product_id', 50);

            // Data Kolom
            $table->string('title', 25);
            $table->string('short_desc', 100)->nullable();
            $table->text('description')->nullable();

            // Di ERD tertulis INTEGER. Jika ingin disamakan dengan tabel lain,
            // ubah menjadi: $table->decimal('price', 12, 2);
            $table->integer('price')->default(0);

            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('depth')->nullable();
            $table->string('unit', 10)->nullable(); // Contoh isian: 'cm', 'mm', 'inch'

            $table->timestamps(); // Otomatis membuat created_at dan updated_at TIMESTAMP

            // Relasi
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_sizes');
    }
};
