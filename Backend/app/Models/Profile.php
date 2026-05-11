<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; 

class Profile extends Model
{
    use HasUuids; 

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'phone',
        'pin',
        'created_by', 
        'updated_by',
    ];

    protected $hidden = [
        'pin',
    ];

    protected $appends = [
        'has_pin',
    ];

    public function getHasPinAttribute()
    {
        return !empty($this->attributes['pin']);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}