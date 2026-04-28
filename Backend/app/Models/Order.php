<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_date',
        'total_amount',
        'payment_method',
        'shipping_address',
        'status',
        'created_by',
        'updated_by',
    ];

    /**
     * Konfigurasi tipe data kolom
     */
    protected function casts(): array
    {
        return [
            'order_date' => 'datetime',
            'total_amount' => 'decimal:2',
        ];
    }

    // --- RELASI ---

    // Mengetahui siapa pembelinya
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Menghubungkan ke detail item yang dibeli (Langkah selanjutnya)
    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }
}