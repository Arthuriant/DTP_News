<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSizes extends Model
{
    protected $table = 'product_sizes';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'product_id',
        'title',
        'short_desc',
        'description',
        'price',
        'width',
        'height',
        'depth',
        'unit',
    ];

    protected $casts = [
        'price'  => 'integer',
        'width'  => 'integer',
        'height' => 'integer',
        'depth'  => 'integer',
    ];
}
