<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Address extends Model
{
    use HasFactory, HasUuids;

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
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'latitude' => 'float',  // Memastikan PHP membacanya sebagai angka desimal
            'longitude' => 'float',
        ];
    }

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}