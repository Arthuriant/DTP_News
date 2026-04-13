<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubCategories extends Model
{
    protected $table = 'sub_categories';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'categories_id',
        'name',
        'description',
    ];

     public function category()
    {
        return $this->belongsTo(Category::class, 'categories_id');
    }
}
