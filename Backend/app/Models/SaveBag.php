<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaveBag extends Model
{
    protected $table = 'save_bag'; // Laravel akan otomatis mencari tabel ini

    protected $fillable = [
        'user_id',
        'product_id',
        'size_id',
        'selected_parts',
        'total_price',
        'design_name'
    ];

    protected $casts = [
        'selected_parts' => 'array',
        'total_price' => 'integer', // Menggunakan integer jika tidak ada desimal (Rp)
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
