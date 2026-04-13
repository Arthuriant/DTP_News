<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductMarketingBlocks extends Model
{
    protected $table = 'product_marketing_blocks';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'product_id',
        'title',
        'subtitle',
        'description',
    ];
}
