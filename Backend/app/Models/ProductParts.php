<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProductParts extends Model
{
    use HasUuids;

    protected $table = 'product_parts';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

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
            'z_index' => 'array',
        ];
    }

    /**
     * Relasi balik ke Product Induk
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function variants()
    {
        return $this->hasMany(PartVariants::class, 'part_id');
    }
}
