<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            // 1. Primary Key UUID
            $table->uuid('id')->primary();

            // 2. Relasi ke Order (UUID)
            $table->uuid('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');

            // 3. Informasi Pengiriman (Sesuai ERD)
            $table->string('courier_name', 100); // Contoh: JNE, J&T, SiCepat
            $table->string('tracking_number', 100)->nullable();
            $table->string('status', 50)->default('pending'); // pending, shipped, out_for_delivery, delivered, failed
            
            // 4. Riwayat & Log (Menggunakan JSONB untuk fleksibilitas log kurir)
            $table->jsonb('tracking_details')->nullable();
            $table->text('notes')->nullable();

            // 5. Informasi Waktu
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            // 6. Audit Trail & Soft Deletes
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};