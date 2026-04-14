<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib ada

class Profile extends Model
{
    use HasUuids; // 👈 Aktifkan UUID otomatis

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'phone',
        'pin',
        'created_by', // 👈 Audit Trail
        'updated_by', // 👈 Audit Trail
    ];

    /**
     * Sembunyikan kolom sensitif agar tidak terkirim saat di-convert ke JSON
     */
    protected $hidden = [
        'pin',
    ];

    /**
     * Relasi balik ke model User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}