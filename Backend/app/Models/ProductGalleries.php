<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductGalleries extends Model
{
    protected $table = 'product_galleries';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'product_id',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];
}
