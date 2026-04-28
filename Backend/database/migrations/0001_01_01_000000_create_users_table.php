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
        // 1. TABEL USERS
        Schema::create('users', function (Blueprint $table) {
            // Sesuai ERD: UUID sebagai Primary Key
            $table->uuid('id')->primary(); 
            
            // Sesuai ERD: Data Utama
            $table->string('name', 100);
            $table->string('email', 255)->unique();
            $table->string('password', 255); // Wajib diisi (tidak nullable)
            
            // Fitur Admin (Suspend/Aktif)
            $table->boolean('is_active')->default(true); 

            // Sesuai ERD: Audit Trail menggunakan UUID
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            
            // Bawaan Laravel & Soft Deletes
            $table->timestamps();
            $table->softDeletes(); 
        });

        // 2. TABEL PASSWORD RESET TOKENS (Bcawaan Laravel)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // 3. TABEL SESSIONS
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            
            // WAJIB UBAH: Karena users.id adalah UUID, maka user_id di tabel ini harus UUID juga
            $table->uuid('user_id')->nullable()->index(); 
            
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};