<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            // 1. Primary Key menggunakan UUID
            $table->uuid('id')->primary();
            
            // 2. Foreign Key ke tabel users (Harus UUID juga)
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // 3. Total Harga (Sesuai ERD, menggunakan BIGINT)
            // Kita beri nilai default 0 karena keranjang baru pasti kosong
            $table->bigInteger('total')->default(0); 

            // 4. Audit Trail
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            
            // 5. Waktu dibuat & diupdate
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};