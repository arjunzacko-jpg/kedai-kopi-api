<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;

Route::get('/debug', function () {
    return response()->json([
        'status' => 'Laravel API is running',
        'app_env' => app()->environment(),
        'database' => config('database.default'),
        'product_count' => \App\Models\Product::count(),
    ]);
});
// =========================================================
// PRODUCTS
// =========================================================

Route::get('/products', [
    ProductController::class,
    'index'
]);

Route::get('/debug-database', [
    ProductController::class,
    'debugDatabase'
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
