<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductDimensions extends Model
{
    protected $table = 'product_dimensions';

    protected $primaryKey = 'product_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'product_id',
        'product_style',
        'total_volumes',
        'weight',
    ];

    protected $casts = [
        'total_volumes' => 'integer',
        'weight' => 'integer',
    ];
}
