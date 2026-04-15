<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\CartController;



Route::post('/cart', [CartController::class, 'store']);
