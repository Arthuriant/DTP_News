<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini
use App\Models\ProductMarketingBlock;

class ProductMarketingBlocks extends Model
{
    use HasUuids;

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
        return $this->hasMany(ProductMarketingFeatures::class, 'block_id')->orderBy('id');
    }

    public function getImgAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }
}
