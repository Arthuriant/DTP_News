<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini
use App\Models\ProductParts;
use App\Models\ProductGalleries;
use App\Models\ProductSizes;
use App\Models\ProductDimensions;
use App\Models\ProductMarketingBlocks; // ← tambah import

class Product extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'products';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    // id sudah dihapus dari fillable
    protected $fillable = [
        'sub_categories_id',
        'name',
        'product_code',
        'description',
        'summary',
        'base_price',
        'img',
        'is_active',
    ];

    /**
     * Konversi tipe data otomatis saat ditarik dari database
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'base_price' => 'decimal:2',
        ];
    }

    /**
     * Relasi balik ke SubCategories
     */
    public function subCategory()
    {
        // Pastikan nama class SubCategories sesuai dengan file model Anda
        return $this->belongsTo(SubCategories::class, 'sub_categories_id');
    }

    public function parts()
    {
        return $this->hasMany(ProductParts::class, 'product_id');
    }

    public function gallery()
    {
        return $this->hasMany(ProductGalleries::class, 'product_id')->orderBy('sort_order');
    }

    public function sizes()
    {
        return $this->hasMany(ProductSizes::class, 'product_id')->orderBy('id');
    }

    public function dimension()
    {
        return $this->hasOne(ProductDimensions::class, 'product_id');
    }

    public function marketingBlocks()
    {
        return $this->hasMany(ProductMarketingBlocks::class, 'product_id')->orderBy('id');
    }
    
    public function getImgAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null; 
    }
}
