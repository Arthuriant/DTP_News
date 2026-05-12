<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; 

class PartTextures extends Model
{
    use HasUuids; 

    protected $table = 'part_textures';

    protected $fillable = [
        'part_id',
        'product_id',
        'variant_id',
        'name',
        'texture_code',
        'price',
        'img_top',
        'img_back',
        'img_front',
        'img_thumb',
        'is_colorable',
        'colors',
        'img_top_mask',
        'img_back_mask',
        'img_front_mask',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_colorable' => 'boolean', 
            'colors'       => 'array', 
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

   public function getImgTopAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }

    public function getImgBackAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }

    public function getImgFrontAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }

    public function getImgThumbAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }

    // --- ACCESSORS UNTUK GAMBAR MASKING ---

    public function getImgTopMaskAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }

    public function getImgBackMaskAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }

    public function getImgFrontMaskAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }
}
