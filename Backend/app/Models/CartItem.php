<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $guarded = [];

    // Tambahkan baris ini agar JSON otomatis diubah jadi Array di PHP
    protected $casts = [
        'customizations' => 'array',
    ];
}