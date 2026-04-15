<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CartController;
use App\Http\Controllers\SavebagController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Middleware\LogUserActivity;
use App\Models\User;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// [UPDATE] Penyesuaian Logout untuk Sanctum
// Route ini harus dilindungi middleware agar sistem tahu token siapa yang mau dihapus
Route::get('/logout', function (Request $request) {
    // 1. Jika menggunakan Autentikasi berbasis Web/Cookie (Session)
    Auth::guard('web')->logout();

    // 2. Jika menggunakan API Token (Sanctum), hapus tokennya
    if ($request->user()) {
        $request->user()->currentAccessToken()->delete();
    }

    // 3. Hancurkan dan buat ulang sesi agar benar-benar bersih
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logout berhasil']);
});


// [UPDATE] Ubah auth menjadi auth:sanctum
Route::get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'roles' => $user->getRoleNames(),
        'permissions' => $user->getAllPermissions()->pluck('name')
    ]);
})->middleware('auth:sanctum');

// [UPDATE] Ubah auth menjadi auth:sanctum
Route::post('/cart', [CartController::class, 'addToCart'])->middleware('auth:sanctum');
Route::delete('/cart/{id}', [CartController::class, 'removeItem'])->middleware('auth:sanctum');
Route::get('/cart', [CartController::class, 'getCart'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Simpan kustomisasi tas
Route::post('/save-bag', [SaveBagController::class, 'store']);

// Ambil daftar tas yang disimpan - [UPDATE] auth:sanctum
Route::get('/save-bag', [SaveBagController::class, 'index'])->middleware('auth:sanctum');

// [UPDATE] Group Middleware auth:sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});

// [UPDATE] Ubah auth menjadi auth:sanctum
Route::get('/addresses', [AddressController::class, 'index'])->middleware('auth:sanctum');
Route::post('/addresses', [AddressController::class, 'store'])->middleware('auth:sanctum');
Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->middleware('auth:sanctum');
Route::patch('/addresses/{id}/set-primary', [AddressController::class, 'setPrimary'])->middleware('auth:sanctum');
Route::put('/addresses/{id}', [AddressController::class, 'update'])->middleware('auth:sanctum');


// Rute untuk produk
Route::get('/products', [ProductController::class, 'index']);

// [UPDATE] Group Middleware ditambahkan :sanctum
Route::middleware(['auth:sanctum', \App\Http\Middleware\LogUserActivity::class])->group(function () {

    // Rute Role & Permission
    Route::get('/roles', [RoleController::class, 'index'])->middleware('can:view_roles');
    Route::post('/roles', [RoleController::class, 'store'])->middleware('can:create_roles');
    Route::put('/roles/{id}', [RoleController::class, 'update'])->middleware('can:edit_roles');
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->middleware('can:delete_roles');

    Route::get('/admins', [AdminController::class, 'index'])->middleware('can:view_users');
    Route::post('/admins', [AdminController::class, 'store'])->middleware('can:create_users');
    Route::put('/admins/{id}', [AdminController::class, 'update'])->middleware('can:edit_users');
    Route::delete('/admins/{id}', [AdminController::class, 'destroy'])->middleware('can:delete_users');

    // -- KELOLA CUSTOMERS --
    Route::get('/customers', [CustomerController::class, 'index'])->middleware('can:view_customers');
    Route::post('/customers', [CustomerController::class, 'store'])->middleware('can:create_customers');
    Route::put('/customers/{id}', [CustomerController::class, 'update'])->middleware('can:edit_customers');
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->middleware('can:delete_customers');
    Route::put('/customers/{id}/toggle-status', [CustomerController::class, 'toggleStatus'])->middleware('can:edit_customers');

});

    Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
});
