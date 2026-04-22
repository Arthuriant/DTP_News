<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Categories extends Model
{
    use HasUuids; 

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'description',
    ];

    // 👇 INI BAGIAN YANG TERLEWAT: Relasi ke tabel SubCategories
    public function sub_categories()
    {
        // 1 Kategori memiliki Banyak (hasMany) Sub-Kategori
        // 'categories_id' adalah nama kolom foreign key di tabel sub_categories
        return $this->hasMany(SubCategories::class, 'categories_id');
    }
}