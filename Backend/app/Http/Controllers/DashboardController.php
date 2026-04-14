<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Pastikan yang akses adalah admin atau super_admin
        $currentUser = Auth::user();

        // ── Total customer ────────────────────────────────────
        $totalCustomer = User::role('customer')->count();

        // ── Customer aktif (30 hari terakhir) ────────────────
        $customerAktif = User::role('customer')
            ->where('updated_at', '>=', now()->subDays(30))
            ->count();

        // ── Customer baru bulan ini ───────────────────────────
        $customerBaruBulanIni = User::role('customer')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // ── Total admin ───────────────────────────────────────
        $totalAdmin = User::role('admin')->count();

        // ── Customer dengan alamat ────────────────────────────
        $customerDenganAlamat = User::role('customer')
            ->whereHas('addresses')
            ->count();

        // ── Customer tanpa alamat ─────────────────────────────
        $customerTanpaAlamat = User::role('customer')
            ->whereDoesntHave('addresses')
            ->count();

        // ── Customer terbaru (5 terakhir) ─────────────────────
        $customerTerbaru = User::role('customer')
            ->with(['profile', 'addresses'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id'           => $user->id,
                    'name'         => $user->name,
                    'email'        => $user->email,
                    'phone'        => $user->profile?->phone,
                    'gender'       => $user->profile?->gender,
                    'total_alamat' => $user->addresses->count(),
                    'alamat_utama' => $user->addresses->where('is_primary', true)->first()?->region,
                    'bergabung'    => $user->created_at->format('d M Y'),
                ];
            });

        // ── Distribusi gender ─────────────────────────────────
        $genderLakiLaki = User::role('customer')
            ->whereHas('profile', fn($q) => $q->where('gender', 'Laki-laki'))
            ->count();

        $genderPerempuan = User::role('customer')
            ->whereHas('profile', fn($q) => $q->where('gender', 'Perempuan'))
            ->count();

        $belumIsiGender = $totalCustomer - $genderLakiLaki - $genderPerempuan;

        return response()->json([
            'admin_login'  => $currentUser->name, // ← siapa yang sedang login
            'ringkasan'    => [
                'total_customer'          => $totalCustomer,
                'customer_aktif'          => $customerAktif,
                'customer_baru_bulan_ini' => $customerBaruBulanIni,
                'total_admin'             => $totalAdmin,
                'customer_dengan_alamat'  => $customerDenganAlamat,
                'customer_tanpa_alamat'   => $customerTanpaAlamat,
            ],
            'gender'           => [
                'laki_laki'   => $genderLakiLaki,
                'perempuan'   => $genderPerempuan,
                'belum_diisi' => $belumIsiGender,
            ],
            'customer_terbaru' => $customerTerbaru,
        ]);
    }
}
