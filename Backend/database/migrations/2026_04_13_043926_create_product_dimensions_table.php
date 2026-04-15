<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_dimensions', function (Blueprint $table) {
            // 1. product_id menjadi Primary Key sekaligus Foreign Key menggunakan UUID
            $table->uuid('product_id')->primary();

            $table->string('product_style', 50)->nullable();
            $table->integer('total_volumes')->nullable();
            $table->integer('weight')->nullable();
            $table->text('img')->nullable();
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_dimensions');
    }
};