<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class PartVariants extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'part_variants';

    protected $fillable = [
        'part_id',
        'product_id',
        'name',
        'variant_code',
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

    public function textures()
    {
        return $this->hasMany(PartTextures::class, 'variant_id');
    }
}
