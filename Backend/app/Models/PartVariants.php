<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartVariants extends Model
{
    protected $table = 'part_variants';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'part_id',
        'product_id',
        'name',
        'price',
    ];

    // Optional (lebih rapi untuk tipe data)
    protected $casts = [
        'price' => 'decimal:2',
    ];
}
