<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class Categories extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'categories';

    // id sudah dihapus dari sini
    protected $fillable = [
        'name',
        'description',
    ];
}