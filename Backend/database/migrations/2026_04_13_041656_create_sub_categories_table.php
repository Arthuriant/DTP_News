<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::create('sub_categories', function (Blueprint $table) {
            $table->uuid('id')->primary(); // 👈 Ubah jadi UUID
            $table->uuid('categories_id'); // 👈 Foreign key wajib UUID juga
            
            $table->string('name', 100);
            $table->string('description', 150)->nullable();
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('categories_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_categories');
    }
};