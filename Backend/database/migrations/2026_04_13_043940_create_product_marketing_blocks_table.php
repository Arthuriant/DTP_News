<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_marketing_blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();       // 👈 Ubah jadi UUID
            $table->uuid('product_id');          // 👈 Foreign Key UUID
            
            $table->string('title', 25);
            $table->string('subtitle', 50)->nullable();
            $table->text('description')->nullable();
            $table->text('img')->nullable();
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_marketing_blocks');
    }
};