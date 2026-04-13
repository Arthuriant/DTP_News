<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary(); // 👈 Ubah jadi UUID
            $table->uuid('sub_categories_id'); // 👈 Foreign Key wajib UUID

            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->string('summary', 100)->nullable();
            $table->decimal('base_price', 12, 2); // DECIMAL(12,2) sudah sangat tepat
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('sub_categories_id')->references('id')->on('sub_categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};