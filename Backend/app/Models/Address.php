<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'recipient_name',
        'phone_number',
        'region',
        'street',
        'details',
        'label',
        'is_primary',
        'latitude',   // 👈 Tambahkan ini
        'longitude',
    ];

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}