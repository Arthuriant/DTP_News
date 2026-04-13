<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib ditambahkan

class Wishlist extends Model
{
    use HasUuids; // 👈 Aktifkan pembuatan UUID otomatis

    // Beri tahu Laravel nama tabelnya secara eksplisit (karena kata 'wishlist' tidak ada bentuk jamaknya seperti 'users')
    protected $table = 'wishlist';

    protected $fillable = [
        'user_id',
        'product_id',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}