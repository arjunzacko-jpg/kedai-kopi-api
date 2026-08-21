<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;


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

Route::get('/debug-database', [
    ProductController::class,
    'debugDatabase'
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
