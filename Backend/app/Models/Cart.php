<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    // Tambahkan baris ini agar semua kolom bisa diisi
    protected $guarded = []; 

    // Relasi ke CartItem (Opsional, tapi sangat berguna nanti)
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }
}