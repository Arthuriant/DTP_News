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
        $table->uuid('id')->primary();
            
            // Relasi ke tabel users (UUID)
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); 
            
            // Data Penerima (Gaya Shopee/Form Anda)
            $table->string('recipient_name', 100); 
            $table->string('phone_number', 20); 
            $table->string('region'); 
            $table->string('street'); 
            $table->string('details')->nullable(); 
            
            // Label & Status Utama
            $table->string('label', 50)->nullable(); 
            $table->boolean('is_primary')->default(false); 

            // Koordinat GPS (Presisi Tinggi sesuai request Anda)
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Audit Trail sesuai ERD
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();

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
