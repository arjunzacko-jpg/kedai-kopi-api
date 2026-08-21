<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;

// =========================================================
// DEBUG DATABASE / SEEDER
// =========================================================

Route::get('/debug-seeder', function () {
    return response()->json([
        'status' => 'API is running',
        'database' => config('database.default'),
        'product_count' => \App\Models\Product::count(),
        'first_product' => \App\Models\Product::first(),
    ]);
});


// =========================================================
// DEBUG DATABASE LAMA
// =========================================================

Route::get('/debug-database', [
    ProductController::class,
    'debugDatabase'
]);


// =========================================================
// PRODUCTS
// =========================================================

Route::get('/products', [
    ProductController::class,
    'index'
]);

Route::post('/products', [
    ProductController::class,
    'store'
]);


// =========================================================
// TRANSACTIONS
// =========================================================

Route::get('/transactions', [
    TransactionController::class,
    'index'
]);

Route::post('/transactions', [
    TransactionController::class,
    'store'
]);
