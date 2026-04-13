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
        Schema::create('part_variants', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // Primary Key
            $table->string('part_id', 50);       // Foreign Key ke product_parts
            $table->string('product_id', 50);    // Foreign Key ke products
            $table->string('name', 100);
            $table->decimal('price', 12, 2);
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('part_id')->references('id')->on('product_parts')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('part_variants');
    }
};
