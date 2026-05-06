<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\PDF;

class DashboardController extends Controller
{
    public function index()
    {
        $currentUser = Auth::user();

        // 1. RINGKASAN STATISTIK (GABUNGAN)
        $totalCustomer = User::role('customer')->count();
        $customerAktif = User::role('customer')
            ->where('updated_at', '>=', now()->subDays(30))
            ->count();
        $customerBaruBulanIni = User::role('customer')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        $revenue = Order::where('status', 'completed')->sum('total_amount'); 
        $totalOrders = Order::count();
        $activeProducts = Product::where('is_active', true)->count();

        // 2. STATUS LOGISTIK (PERSENTASE)
        $completedOrders = Order::where('status', 'completed')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $pendingOrders = Order::where('status', 'pending')->count();

        $completedPct = $totalOrders > 0 ? round(($completedOrders / $totalOrders) * 100) : 0;
        $processingPct = $totalOrders > 0 ? round(($processingOrders / $totalOrders) * 100) : 0;
        $pendingPct = $totalOrders > 0 ? round(($pendingOrders / $totalOrders) * 100) : 0;

        // 3. LOGIKA KATEGORI TERPOPULER (DATA NYATA)
        $terjual = OrderDetail::whereHas('order', function ($query) {
            $query->where('status', 'completed');
        })->with('product.subCategory')->get();

        $totalTerjual = $terjual->count();
        $kategoriGrup = $terjual->groupBy(function ($item) {
            return $item->product && $item->product->subCategory 
                ? $item->product->subCategory->name 
                : 'Lainnya';
        });

        $topCategories = [];
        foreach ($kategoriGrup as $namaKategori => $items) {
            $jumlah = $items->count();
            $persentase = $totalTerjual > 0 ? round(($jumlah / $totalTerjual) * 100) : 0;
            $topCategories[] = [
                'name' => $namaKategori,
                'percentage' => $persentase,
            ];
        }
        usort($topCategories, fn($a, $b) => $b['percentage'] <=> $a['percentage']);
        $topCategories = array_slice($topCategories, 0, 4);

        // 4. GRAFIK PENDAPATAN 6 BULAN TERAKHIR
        $revenueChart = [];
        $chartLabels = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::today()->startOfMonth()->subMonths($i);
            $monthlyRevenue = Order::where('status', 'completed')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total_amount');
            
            // Normalisasi skala 0-100 untuk grafik SVG di React
            $maxRevenueLimit = 50000000; // Contoh limit 50 Juta
            $percentage = min(100, round(($monthlyRevenue / $maxRevenueLimit) * 100));
            // $revenueChart[] = $percentage == 0 ? 5 : $percentage;
            // // Kirim nominal asli, BUKAN persentase lagi
            $revenueChart[] = $monthlyRevenue;
            // Kirim nama bulan (Contoh: "Jan", "Feb")
            $chartLabels[] = $month->translatedFormat('M');
        }

        // 5. DISTRIBUSI GENDER & PELANGGAN TERBARU
        $genderLakiLaki = User::role('customer')
            ->whereHas('profile', fn($q) => $q->where('gender', 'Laki-laki'))
            ->count();
        $genderPerempuan = User::role('customer')
            ->whereHas('profile', fn($q) => $q->where('gender', 'Perempuan'))
            ->count();
        $belumIsiGender = $totalCustomer - $genderLakiLaki - $genderPerempuan;

        $customerTerbaru = User::role('customer')
            ->with(['profile', 'addresses'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'name'      => $user->name,
                    'email'     => $user->email,
                    'bergabung' => $user->created_at->format('d M Y'),
                ];
            });

        // 6. JSON RESPONSE FINAL
        return response()->json([
            'admin_login' => $currentUser->name,
            'stats' => [
                'revenue'        => $revenue,
                'totalOrders'    => $totalOrders,
                'activeProducts' => $activeProducts,
                'totalCustomers' => $totalCustomer,
                'customer_aktif' => $customerAktif,
                'customer_baru'  => $customerBaruBulanIni,
            ],
            'revenueChart'  => $revenueChart,
            'chartLabels'   => $chartLabels,
            'orderStatus'   => [
                'completed'  => $completedPct,
                'processing' => $processingPct,
                'pending'    => $pendingPct,
            ],
            'gender' => [
                'laki_laki'   => $genderLakiLaki,
                'perempuan'   => $genderPerempuan,
                'belum_diisi' => $belumIsiGender,
            ],
            'customer_terbaru' => $customerTerbaru,
            'topCategories'    => $topCategories,
        ]);
    }
    public function downloadPdf()
    {
        // 1. Ambil data ringkasan singkat untuk laporan
        $revenue = Order::where('status', 'completed')->sum('total_amount'); 
        $totalOrders = Order::count();
        $totalCustomer = User::role('customer')->count();

        $dataLaporan = [
            'tanggal_cetak' => now()->format('d M Y H:i:s'),
            'admin_pencetak' => Auth::user()->name,
            'total_pendapatan' => $revenue,
            'total_pesanan' => $totalOrders,
            'total_pelanggan' => $totalCustomer,
        ];

        // 2. Buat file HTML sederhana untuk PDF
        // (Di masa depan, Anda bisa mengganti ini dengan file view blade khusus seperti 'admin.reports.dashboard')
        $html = "
            <h1 style='text-align:center; color:#2D1A11;'>Laporan Eksekutif UpToYou</h1>
            <p><strong>Tanggal Dicetak:</strong> {$dataLaporan['tanggal_cetak']}</p>
            <p><strong>Dicetak Oleh:</strong> {$dataLaporan['admin_pencetak']}</p>
            <hr>
            <h3>Ringkasan Performa:</h3>
            <ul>
                <li>Total Pendapatan: Rp " . number_format($dataLaporan['total_pendapatan'], 0, ',', '.') . "</li>
                <li>Total Pesanan Selesai: {$dataLaporan['total_pesanan']} Transaksi</li>
                <li>Total Pelanggan Terdaftar: {$dataLaporan['total_pelanggan']} Akun</li>
            </ul>
        ";

        // 3. Render menjadi PDF dan kirimkan ke Frontend
        $pdf = PDF::loadHTML($html);
        return $pdf->download('Laporan_Dasbor.pdf');
    }
}