<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_parts', function (Blueprint $table) {
            $table->uuid('id')->primary(); // 👈 Ubah jadi UUID
            $table->uuid('product_id');    // 👈 Foreign Key wajib UUID

            $table->string('name', 100);
            $table->string('part_code', 50);
            $table->json('z_index');
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_parts');
    }
};