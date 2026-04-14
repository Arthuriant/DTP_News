<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class ProductMarketingFeatures extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'product_marketing_features';

    protected $fillable = [
        'product_id',
        'block_id',
        'title',
    ];

    // --- RELASI ---
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function block()
    {
        return $this->belongsTo(ProductMarketingBlocks::class, 'block_id');
    }
}