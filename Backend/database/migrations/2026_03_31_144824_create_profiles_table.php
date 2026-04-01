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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel users. Jika user dihapus, profilnya otomatis terhapus (cascade)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Biodata tambahan
            $table->date('date_of_birth')->nullable();

            $table->string('phone')->nullable();

            // Jenis kelamin (bisa pakai string atau enum)
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
