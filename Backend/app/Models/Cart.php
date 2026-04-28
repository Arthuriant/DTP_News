<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Import ini wajib ada

class Cart extends Model
{
    use HasUuids; // 👈 Aktifkan pembuatan UUID otomatis

    // Tentukan kolom apa saja yang boleh diisi
    protected $fillable = [
        'user_id',
        'total',
        'created_by',
        'updated_by',
    ];

    // Relasi ke CartItem
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    // Relasi balik ke User (Opsional tapi sangat disarankan)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}