<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            // 1. Primary Key UUID
            $table->uuid('id')->primary();

            // 2. Relasi ke pesanan (UUID)
            // Jika pesanan dihapus, riwayat pembayarannya ikut terhapus
            $table->uuid('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');

            // 3. Detail Pembayaran
            $table->string('payment_method', 50); // cth: 'Bank Transfer', 'GoPay', 'Credit Card'
            $table->decimal('amount', 15, 2); // Jumlah yang dibayar
            $table->dateTime('payment_date')->nullable(); // Kapan berhasil dibayar?
            
            // 4. Status Pembayaran (cth: pending, success, failed, expired)
            $table->string('status', 50)->default('pending');

            // 5. Bukti & Log Integrasi (Sesuai ERD Anda)
            $table->text('receipt_url')->nullable(); // Link gambar bukti transfer manual (jika ada)
            $table->jsonb('payload')->nullable(); // Menyimpan respons JSON asli dari Midtrans/Xendit

            // 6. Audit Trail & Soft Deletes (Sangat penting untuk data keuangan!)
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};