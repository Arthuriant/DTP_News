<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('part_textures', function (Blueprint $table) {
            $table->uuid('id')->primary();       // 👈 Ubah jadi UUID
            $table->uuid('part_id');             // 👈 Foreign Key UUID
            $table->uuid('product_id');          // 👈 Foreign Key UUID
            $table->uuid('variant_id');          // 👈 Foreign Key UUID

            $table->string('name', 100);
            $table->decimal('price', 12, 2);
            $table->string('img_top')->nullable();
            $table->string('img_back')->nullable();
            $table->string('img_front')->nullable();
            $table->string('img_thumb')->nullable();
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('part_id')->references('id')->on('product_parts')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('variant_id')->references('id')->on('part_variants')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('part_textures');
    }
};
