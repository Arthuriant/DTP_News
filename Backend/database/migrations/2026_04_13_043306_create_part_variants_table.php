<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('part_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();       // 👈 Ubah jadi UUID
            $table->uuid('part_id');             // 👈 Foreign Key UUID
            $table->uuid('product_id');          // 👈 Foreign Key UUID
            
            $table->string('name', 100);
            $table->string('variant_code', 50);
            $table->decimal('price', 12, 2);
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('part_id')->references('id')->on('product_parts')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('part_variants');
    }
};