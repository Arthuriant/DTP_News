<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            // 1. Primary Key UUID
            $table->uuid('id')->primary();

            // 2. Relasi ke tabel users (UUID)
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // 3. Data Transaksi (Sesuai ERD)
            $table->dateTime('order_date'); 
            $table->decimal('total_amount', 15, 2); // Presisi tinggi untuk uang
            $table->string('payment_method', 50)->nullable();
            $table->text('shipping_address'); // Disimpan sebagai text (snapshot alamat saat itu)
            
            // 4. Status Pesanan (Contoh: pending, processing, shipped, completed, cancelled)
            $table->string('status', 50)->default('pending');

            // 5. Audit Trail & Soft Deletes
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};