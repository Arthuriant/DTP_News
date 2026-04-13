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
        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // VARCHAR(50) (PK)
            $table->string('sub_categories_id', 50); // Foreign Key ke sub_categories
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('summary', 100)->nullable();
            $table->decimal('base_price', 12, 2); // DECIMAL (12.2)
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('sub_categories_id')->references('id')->on('sub_categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
