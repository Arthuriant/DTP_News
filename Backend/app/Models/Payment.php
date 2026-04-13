<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'payment_date',
        'status',
        'receipt_url',
        'payload',
        'created_by',
        'updated_by',
    ];

    /**
     * Konfigurasi tipe data otomatis
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'payment_date' => 'datetime',
            'payload' => 'array', // Mengubah JSONB dari database menjadi Array di PHP
        ];
    }

    // --- RELASI ---

    // Mengetahui pembayaran ini untuk pesanan yang mana
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}