<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // 👈 Wajib tambah ini

class ProductGalleries extends Model
{
    use HasUuids; // 👈 Auto-pilot UUID aktif!

    protected $table = 'product_galleries';

    protected $fillable = [
        'product_id',
        'image_url',   // 👈 Tambahkan ini agar bisa disimpan dari Controller
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    // --- RELASI ---
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}