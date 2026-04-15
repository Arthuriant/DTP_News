<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class ProductMarketingBlocks extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'product_marketing_blocks';

    protected $fillable = [
        'product_id',
        'title',
        'subtitle',
        'description',
        'img',
    ];

    // --- RELASI ---
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // 1 Blok bisa punya banyak Fitur
    public function features()
    {
        return $this->hasMany(ProductMarketingFeatures::class, 'block_id');
    }
}