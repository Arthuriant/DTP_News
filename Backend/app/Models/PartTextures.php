<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PartTextures extends Model
{
    protected $table = 'part_textures';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'part_id',
        'product_id',
        'variant_id',
        'name',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
}
