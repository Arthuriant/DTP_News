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
       Schema::create('sub_categories', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // VARCHAR(50) (PK)
            $table->string('categories_id', 50); // Foreign Key ke categories
            $table->string('name', 100);
            $table->string('description', 150)->nullable();
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('categories_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_categories');
    }
};
