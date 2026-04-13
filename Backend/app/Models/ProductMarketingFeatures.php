<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductMarketingFeatures extends Model
{
    protected $table = 'product_marketing_features';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'product_id',
        'block_id',
        'title',
    ];
}
