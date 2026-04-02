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
    Schema::create('addresses', function (Blueprint $table) {
        $table->id();
        // Relasi ke tabel users
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); 
        
        // Data sesuai form Shopee
        $table->string('recipient_name'); // Nama Lengkap
        $table->string('phone_number'); // Nomor Telepon
        $table->string('region'); // Provinsi, Kota, Kecamatan, Kode Pos
        $table->string('street'); // Nama Jalan, Gedung, No. Rumah
        $table->string('details')->nullable(); // Detail Lainnya (Blok/Patokan)
        
        // Label dan Status Utama
        $table->enum('label', ['Rumah', 'Kantor'])->nullable(); // Tandai Sebagai
        $table->boolean('is_primary')->default(false); // Atur sebagai Utama
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
