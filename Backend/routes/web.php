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
use App\Http\Controllers\ProductPartsController;
use App\Http\Controllers\PartVariantsController;
use App\Http\Controllers\PartTexturesController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Middleware\LogUserActivity;
use App\Models\User;
use App\Http\Controllers\ProductGalleryController;
use App\Http\Controllers\ProductDimensionController;
use App\Http\Controllers\ProductMarketingBlockController;
use App\Http\Controllers\ProductMarketingFeatureController;
use App\Http\Controllers\ProductSizeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ShippingController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderDetailController;
use App\Http\Controllers\PaymentController;

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


Route::post('/register', [AuthController::class, 'register']);
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated'], 401);
})->name('login'); // ← wajib ada ->name('login')

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


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/wishlist',                    [WishlistController::class, 'index']);
    Route::post('/wishlist',                   [WishlistController::class, 'store']);
    Route::delete('/wishlist/{product_id}',    [WishlistController::class, 'destroy']);
    Route::get('/wishlist/check/{product_id}', [WishlistController::class, 'check']);
    Route::put('/wishlist/{product_id}', [WishlistController::class, 'update']);
});
// Admin & Super Admin - bisa CRUD
Route::get('/categories/with-product-count', [CategoryController::class, 'indexWithProductCount']);
Route::get('/products/filter', [CategoryController::class, 'filterProducts']);

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

    Route::get('/product-galleries/{product_id}', [ProductGalleryController::class, 'index']);
    Route::post('/product-galleries', [ProductGalleryController::class, 'store']);
    Route::delete('/product-galleries/{id}', [ProductGalleryController::class, 'destroy']);
    Route::put('/product-galleries/reorder', [ProductGalleryController::class, 'reorder']);

    Route::get('/product-dimensions/{product_id}', [ProductDimensionController::class, 'show']);
    Route::post('/product-dimensions/{product_id}', [ProductDimensionController::class, 'store']);
    Route::delete('/product-dimensions/{product_id}', [ProductDimensionController::class, 'destroy']);

    Route::get('/product-marketing-blocks/{product_id}', [ProductMarketingBlockController::class, 'index']);
    Route::post('/product-marketing-blocks', [ProductMarketingBlockController::class, 'store']);
    Route::put('/product-marketing-blocks/{id}', [ProductMarketingBlockController::class, 'update']);
    Route::delete('/product-marketing-blocks/{id}', [ProductMarketingBlockController::class, 'destroy']);

    Route::get('/product-marketing-features/{block_id}', [ProductMarketingFeatureController::class, 'index']);
    Route::post('/product-marketing-features', [ProductMarketingFeatureController::class, 'store']);
    Route::put('/product-marketing-features/{id}', [ProductMarketingFeatureController::class, 'update']);
    Route::delete('/product-marketing-features/{id}', [ProductMarketingFeatureController::class, 'destroy']);

    Route::get('/product-sizes/{product_id}', [ProductSizeController::class, 'index']);
    Route::post('/product-sizes', [ProductSizeController::class, 'store']);
    Route::put('/product-sizes/{id}', [ProductSizeController::class, 'update']);
    Route::delete('/product-sizes/{id}', [ProductSizeController::class, 'destroy']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::patch('/products/{id}/toggle', [ProductController::class, 'toggle']);

    Route::get('/product-parts', [ProductPartsController::class, 'index']);
    Route::get('/product-parts/{id}', [ProductPartsController::class, 'show']);
    Route::post('/product-parts', [ProductPartsController::class, 'store']);
    Route::put('/product-parts/{id}', [ProductPartsController::class, 'update']);
    Route::delete('/product-parts/{id}', [ProductPartsController::class, 'destroy']);

    Route::get('/part-variants', [PartVariantsController::class, 'index']);
    Route::get('/part-variants/{id}', [PartVariantsController::class, 'show']);
    Route::post('/part-variants', [PartVariantsController::class, 'store']);
    Route::put('/part-variants/{id}', [PartVariantsController::class, 'update']);
    Route::delete('/part-variants/{id}', [PartVariantsController::class, 'destroy']);

    Route::get('/part-textures', [PartTexturesController::class, 'index']);
    Route::get('/part-textures/{id}', [PartTexturesController::class, 'show']);
    Route::post('/part-textures', [PartTexturesController::class, 'store']);
    Route::put('/part-textures/{id}', [PartTexturesController::class, 'update']);
    Route::delete('/part-textures/{id}', [PartTexturesController::class, 'destroy']);


    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    Route::post('/sub-categories', [CategoryController::class, 'storeSubCategory']);
    Route::put('/sub-categories/{id}', [CategoryController::class, 'updateSubCategory']);
    Route::delete('/sub-categories/{id}', [CategoryController::class, 'destroySubCategory']);

    Route::post('/cart', [CartController::class, 'addToCart']);
    Route::delete('/cart/{id}', [CartController::class, 'removeItem']);
    Route::put('/cart/{id}', [CartController::class, 'updateQuantity']);

    Route::post('/checkout',    [OrderController::class, 'checkout']);
    Route::get('/my-orders',    [OrderController::class, 'getMyOrders']);
    Route::put('/my-orders/{id}/confirm',       [OrderController::class, 'confirmReceived']);
    Route::get('/admin/orders', [OrderController::class, 'getAllOrders']);

    Route::get('/admin/order-details/{id}', [OrderDetailController::class, 'index']);
    Route::get('/admin/order-details/{id}/download-pdf', [OrderDetailController::class, 'downloadPdf']);
    Route::get('/my-orders', [OrderController::class, 'getMyOrders']);
    Route::post('/my-orders/{id}/complete', [OrderController::class, 'confirmDelivery']);
    Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::put('/admin/orders/{id}/resi', [OrderController::class, 'updateResi']);
});

Route::get('/cart', [CartController::class, 'getCart']);


    Route::middleware(['auth:sanctum', 'role:super_admin|admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
});
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    Route::prefix('shipping')->group(function () {
    Route::get('/provinces',    [ShippingController::class, 'provinces']);
    Route::get('/destinations', [ShippingController::class, 'destinations']);
    Route::post('/cost',        [ShippingController::class, 'cost']);
    Route::get('/couriers',     [ShippingController::class, 'couriers']);
});
    Route::prefix('payment')->group(function () {
    Route::get('/methods',         [PaymentController::class, 'methods']);
    Route::post('/create',         [PaymentController::class, 'create']);
    Route::get('/status/{id}',     [PaymentController::class, 'status']);
    Route::post('/callback',       [PaymentController::class, 'callback']);
});
    Route::post('/webhook/xendit', [OrderController::class, 'webhook']);

