<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil User dan Product pertama sebagai kelinci percobaan
        $user = User::first();
        $product = Product::first();

        // Pencegahan error jika tabel User atau Product masih kosong
        if (!$user || !$product) {
            $this->command->warn('Gagal! Pastikan Anda sudah memiliki minimal 1 User dan 1 Product di database.');
            return;
        }

        $this->command->info('Membuat data pesanan...');

        // 1. Buat Induk Pesanan (Order)
        $order = Order::create([
            'id'               => Str::uuid(),
            'user_id'          => $user->id,
            'order_date'       => now(),
            'total_amount'     => 1415000, // Contoh total 2 tas
            'payment_method'   => 'Manual Transfer BCA',
            'shipping_address' => 'Jl. Kanayakan No. 21, Dago, Bandung, Jawa Barat (Titipkan di pos satpam)',
            'status'           => 'pending',
            'created_by'       => $user->id,
        ]);

        // 2. Buat Detail Barang ke-1 (Order Detail)
        OrderDetail::create([
            'id'                   => Str::uuid(),
            'order_id'             => $order->id,
            'product_id'           => $product->id,
            'qty'                  => 1,
            'price'                => 720000,
            'custom_configuration' => [
                'size'          => 'Kompak (S)',
                'colors'        => ['body' => '#2D1A11', 'strap' => '#D9B35A'],
                'image_preview' => 'https://via.placeholder.com/500x500.png?text=Preview+Tas+1'
            ],
            'created_by'           => $user->id,
        ]);

        // 3. Buat Detail Barang ke-2 (Order Detail)
        OrderDetail::create([
            'id'                   => Str::uuid(),
            'order_id'             => $order->id,
            'product_id'           => $product->id,
            'qty'                  => 1,
            'price'                => 695000,
            'custom_configuration' => [
                'size'          => 'Besar (L)',
                'colors'        => ['body' => '#FFFFFF', 'strap' => '#000000'],
                'image_preview' => 'https://via.placeholder.com/500x500.png?text=Preview+Tas+2'
            ],
            'created_by'           => $user->id,
        ]);

        $this->command->info('OrderSeeder berhasil dieksekusi! 1 Pesanan dengan 2 Tas telah masuk ke database.');
    }
}