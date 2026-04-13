<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SubCategories extends Model
{
    use HasUuids;

    protected $table = 'sub_categories';

    protected $fillable = [
        'categories_id',
        'name',
        'description',
    ];

    public function category()
    {
        // 👈 Perbaikan nama class menjadi Categories::class (sesuai nama file modelnya)
        return $this->belongsTo(Categories::class, 'categories_id');
    }
}