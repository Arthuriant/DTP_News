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
        Schema::create('product_marketing_blocks', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // Primary Key
            $table->string('product_id', 50);    // Foreign Key ke products
            $table->string('title', 25);
            $table->string('subtitle', 50)->nullable();
            $table->text('description')->nullable();
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
        Schema::dropIfExists('product_marketing_blocks');
    }
};
