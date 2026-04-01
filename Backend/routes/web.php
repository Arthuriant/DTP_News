<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CartController;

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