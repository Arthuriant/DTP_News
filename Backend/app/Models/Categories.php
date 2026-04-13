<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
     protected $table = 'categories';
     // Primary key bukan integer
    protected $primaryKey = 'id';

    // Karena bukan auto increment
    public $incrementing = false;

    // Karena tipe primary key adalah string
    protected $keyType = 'string';

    // Kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'id',
        'name',
        'description',
    ];
}
