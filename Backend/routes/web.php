<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CartController;
use App\Http\Controllers\SavebagController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AddressController;

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
Route::get('/user', function () {
    return response()->json(Auth::user());
});

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
});

Route::get('/addresses', [AddressController::class, 'index'])->middleware('auth');
Route::post('/addresses', [AddressController::class, 'store'])->middleware('auth');
Route::delete('/addresses/{id}', [AddressController::class, 'destroy'])->middleware('auth');
Route::patch('/addresses/{id}/set-primary', [AddressController::class, 'setPrimary'])->middleware('auth');
Route::put('/addresses/{id}', [AddressController::class, 'update'])->middleware('auth');
