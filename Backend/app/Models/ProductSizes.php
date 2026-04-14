<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class ProductSizes extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'product_sizes';

    // 'id' dihapus dari fillable
    protected $fillable = [
        'product_id',
        'title',
        'short_desc',
        'description',
        'price',
        'width',
        'height',
        'depth',
        'unit',
    ];

    /**
     * Konversi tipe data otomatis menggunakan metode modern
     */
    protected function casts(): array
    {
        return [
            'price'  => 'decimal:2', // 👈 Sesuaikan dengan migration (decimal)
            'width'  => 'integer',
            'height' => 'integer',
            'depth'  => 'integer',
        ];
    }

    // --- RELASI ---
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}