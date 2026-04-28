<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib ditambahkan

class CartItem extends Model
{
    use HasUuids; // 👈 Aktifkan UUID otomatis

    protected $fillable = [
        'cart_id',
        'product_id',
        'qty',
        'price',
        'custom_configuration',
        'image_preview',
        'created_by',
        'updated_by',
    ];

    /**
     * Casting data agar JSON dari database otomatis jadi Array di PHP
     * Ini cara modern (Laravel 11) pengganti protected $casts = [...]
     */
    protected function casts(): array
    {
        return [
            'custom_configuration' => 'array',
            'price' => 'integer',
        ];
    }

    // --- RELASI (Opsional tapi sangat penting nantinya) ---

    // Relasi ke Cart (Keranjang Induk)
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    // Relasi ke Product
    public function product()
    {
        // Asumsi nanti Anda punya model Product
        return $this->belongsTo(Product::class); 
    }
}