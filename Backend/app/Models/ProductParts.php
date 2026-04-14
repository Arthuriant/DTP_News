<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class ProductParts extends Model 
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'product_parts';

    // 'id' sudah dihapus dari fillable
    protected $fillable = [
        'product_id',
        'name',
        'z_index',
    ];

    /**
     * Konversi tipe data otomatis
     */
    protected function casts(): array
    {
        return [
            'z_index' => 'integer',
        ];
    }

    /**
     * Relasi balik ke Product Induk
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}