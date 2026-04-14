<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_marketing_features', function (Blueprint $table) {
            $table->uuid('id')->primary();       // 👈 Ubah jadi UUID
            $table->uuid('product_id');          // 👈 Foreign Key UUID
            $table->uuid('block_id');            // 👈 Foreign Key UUID

            $table->string('title', 25);
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('block_id')->references('id')->on('product_marketing_blocks')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_marketing_features');
    }
};