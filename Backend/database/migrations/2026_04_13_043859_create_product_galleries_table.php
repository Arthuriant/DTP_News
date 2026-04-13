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
        Schema::create('product_galleries', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // Primary Key
            $table->string('product_id', 50);    // Foreign Key ke products
            $table->integer('sort_order')->default(0); // Default 0 jika urutan tidak diisi
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_galleries');
    }
};
