<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;


// =========================================================
// TEST RAILWAY
// =========================================================

Route::get('/railway-test-123', function () {
    return response()->json([
        'message' => 'KODE TERBARU SUDAH MASUK RAILWAY',
        'commit' => '4aae143',
    ]);
});


// =========================================================
// TEST DATABASE
// =========================================================

Route::get('/database-test-123', function () {
    try {
        $productCount = \App\Models\Product::count();

        return response()->json([
            'status' => 'database connected',
            'database' => config('database.default'),
            'product_count' => $productCount,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'database error',
            'message' => $e->getMessage(),
        ], 500);
    }
});


// =========================================================
// DEBUG DATABASE / SEEDER
// =========================================================

Route::get('/debug-seeder', function () {
    try {
        return response()->json([
            'status' => 'API is running',
            'database' => config('database.default'),
            'product_count' => \App\Models\Product::count(),
            'first_product' => \App\Models\Product::first(),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'database error',
            'message' => $e->getMessage(),
        ], 500);
    }
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
