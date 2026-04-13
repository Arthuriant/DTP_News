<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class PartTextures extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'part_textures';

    protected $fillable = [
        'part_id',
        'product_id',
        'variant_id',
        'name',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }

    // --- RELASI ---
    public function part()
    {
        return $this->belongsTo(ProductParts::class, 'part_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function variant()
    {
        return $this->belongsTo(PartVariants::class, 'variant_id');
    }
}