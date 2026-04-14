<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shipment extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'order_id',
        'courier_name',
        'tracking_number',
        'status',
        'tracking_details',
        'notes',
        'shipped_at',
        'delivered_at',
        'created_by',
        'updated_by',
    ];

    /**
     * Casting data otomatis
     */
    protected function casts(): array
    {
        return [
            'tracking_details' => 'array',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    // Relasi balik ke Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}