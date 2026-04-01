<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    // Kolom apa saja yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'phone',
    ];

    /**
     * Relasi balik ke model User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
