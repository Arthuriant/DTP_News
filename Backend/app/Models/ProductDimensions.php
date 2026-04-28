<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDimensions extends Model
{
    protected $table = 'product_dimensions';

    // Beri tahu Laravel bahwa Primary Key-nya adalah product_id
    protected $primaryKey = 'product_id';

    // Matikan auto-increment karena ini UUID dari tabel lain
    public $incrementing = false;

    // Beri tahu Laravel bahwa formatnya adalah teks/string (UUID)
    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'product_style',
        'total_volumes',
        'weight',
        'img',
    ];

    /**
     * Konversi tipe data otomatis gaya Laravel modern
     */
    protected function casts(): array
    {
        return [
            'total_volumes' => 'integer',
            'weight' => 'integer',
        ];
    }

    // --- RELASI ---
    /**
     * Relasi balik ke Product (One-to-One)
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}