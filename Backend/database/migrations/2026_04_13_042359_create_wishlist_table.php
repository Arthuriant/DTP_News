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
        Schema::create('wishlist', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // VARCHAR(50) (PK)
            $table->string('product_id', 50);    // VARCHAR(50) (FK) ke tabel products

            // ⚠️ CATATAN PENTING UNTUK user_id:
            // Di gambar ERD, tipe datanya adalah VARCHAR(50).
            // Namun, di kode contoh tabel 'users' pada pertanyaan pertamamu, kamu menggunakan `$table->id();` (yang berarti Unsigned BigInt).
            // Agar relasi tidak error (tipe data harus sama persis), saya menggunakan unsignedBigInteger di sini.
            // Jika tabel users kamu ternyata menggunakan VARCHAR, silakan ubah baris di bawah ini menjadi: $table->string('user_id', 50);
            $table->unsignedBigInteger('user_id'); // (FK) ke tabel users


            // $table->timestamps() otomatis membuat kolom `created_at` dan `updated_at` dengan tipe TIMESTAMP
            $table->timestamps();

            // Relasi Foreign Key
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlist');
    }
};
