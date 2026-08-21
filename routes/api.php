<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API Laravel Railway berhasil',
        'status' => 'OK',
    ]);
});

Route::get('/database-test', function () {
    try {
        return response()->json([
            'status' => 'database connected',
            'database' => config('database.default'),
            'product_count' => \App\Models\Product::count(),
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'database error',
            'message' => $e->getMessage(),
        ], 500);
    }
});

Route::get('/products', [
    ProductController::class,
    'index'
]);

Route::post('/products', [
    ProductController::class,
    'store'
]);

Route::get('/transactions', [
    TransactionController::class,
    'index'
]);

Route::post('/transactions', [
    TransactionController::class,
    'store'
]);
