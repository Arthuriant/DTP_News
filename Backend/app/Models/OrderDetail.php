<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class OrderDetail extends Model
{
    use HasUuids;

    protected $fillable = [
        'order_id',
        'product_id',
        'qty',
        'price',
        'custom_configuration',
        'created_by',
        'updated_by',
    ];

    /**
     * Konfigurasi tipe data
     * custom_configuration otomatis menjadi Array saat ditarik ke Frontend
     */
    protected function casts(): array
    {
        return [
            'custom_configuration' => 'array',
            'price' => 'decimal:2',
            'qty' => 'integer',
        ];
    }

    // --- RELASI ---

    // Mengetahui item ini milik pesanan yang mana
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Mengetahui item ini merujuk ke produk master yang mana
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}