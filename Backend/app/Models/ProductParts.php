<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductParts extends Model
{
    protected $table = 'product_parts';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'product_id',
        'name',
        'z_index',
    ];
}
