<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CartController;
use App\Http\Controllers\SavebagController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RoleController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
// Pastikan menggunakan ::get, bukan ::post
Route::get('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return response()->json(['message' => 'Logout berhasil']);
});
Route::get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        // 👇 Ini dia kunci utamanya! Mengambil daftar pangkat dari Spatie
        'roles' => $user->getRoleNames(),
        'permissions' => $user->getAllPermissions()->pluck('name')
    ]);
})->middleware('auth');

Route::post('/cart', [CartController::class, 'addToCart'])->middleware('auth');
Route::delete('/cart/{id}', [CartController::class, 'removeItem'])->middleware('auth');
Route::get('/cart', [CartController::class, 'getCart'])->middleware('auth');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Simpan kustomisasi tas
Route::post('/save-bag', [SaveBagController::class, 'store']);

// Ambil daftar tas yang disimpan
Route::get('/save-bag', [SaveBagController::class, 'index'])->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
}); // ← tutup di sini

Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::delete('/admins/{id}', [AdminController::class, 'destroy']);
});

Route::get('/addresses', [AddressController::class, 'index'])->middleware('auth');
Route::post('/addresses', [AddressController::class, 'store'])->middleware('auth');
Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->middleware('auth');
Route::patch('/addresses/{id}/set-primary', [AddressController::class, 'setPrimary'])->middleware('auth');
Route::put('/addresses/{id}', [AddressController::class, 'update'])->middleware('auth');

Route::middleware(['auth'])->group(function () {
    // Rute Role & Permission - Dilindungi oleh kunci spesifik (Spatie / Gate)
    Route::get('/roles', [RoleController::class, 'index'])->middleware('can:view_roles');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('can:create_roles');
    Route::put('/roles/{id}', [RoleController::class, 'update'])->middleware('can:edit_roles');
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->middleware('can:delete_roles');

    Route::get('/admins', [AdminController::class, 'index'])->middleware('can:view_users');
    Route::post('/admins', [AdminController::class, 'store'])->middleware('can:create_users');
    Route::put('/admins/{id}', [AdminController::class, 'update'])->middleware('can:edit_users');
    Route::delete('/admins/{id}', [AdminController::class, 'destroy'])->middleware('can:delete_users');
});

    // Admin dan Super Admin bisa lihat data customer
    Route::middleware(['auth', 'role:super_admin|admin'])->group(function () {
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::post('/customers', [CustomerController::class, 'store']);
        Route::put('/customers/{id}', [CustomerController::class, 'update']);
        Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);
    });
