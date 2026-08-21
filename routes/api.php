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
    ]);
});


// =========================================================
// TEST ROUTE
// =========================================================

Route::get('/route-test-456', function () {
    return response()->json([
        'message' => 'ROUTE TEST BERHASIL',
    ]);
});


// =========================================================
// TEST DATABASE
// =========================================================

Route::get('/database-test-123', function () {
    try {
        $count = \App\Models\Product::count();

        return response()->json([
            'status' => 'database connected',
            'database' => config('database.default'),
            'product_count' => $count,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'database error',
            'message' => $e->getMessage(),
        ], 500);
    }
});


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
