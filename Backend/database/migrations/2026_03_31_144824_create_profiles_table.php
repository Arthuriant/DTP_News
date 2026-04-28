<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            // 1. Primary Key wajib UUID
            $table->uuid('id')->primary();

            // 2. Relasi ke tabel users (UUID)
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // 3. Biodata tambahan
            $table->date('date_of_birth')->nullable();
            $table->string('phone', 20)->nullable();
            
            // 4. Keamanan Tambahan
            $table->string('pin')->nullable(); 

            // 5. Jenis kelamin (Gunakan string(10) alih-alih enum agar lebih aman saat migrasi)
            $table->string('gender', 10)->nullable();
            
            // 6. Audit Trail (Sesuai Standar ERD Anda)
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};