<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // =========================================================
    // MENAMPILKAN SEMUA PRODUK
    // =========================================================

    public function index()
    {
        return response()->json(
            Product::orderBy('id', 'asc')->get()
        );
    }


    // =========================================================
    // DEBUG DATABASE
    // =========================================================

    public function debugDatabase()
    {
        return response()->json([
            'database' => config('database.default'),
            'database_name' => config(
                'database.connections.' . config('database.default') . '.database'
            ),
            'product_count' => Product::count(),
        ]);
    }


    // =========================================================
    // MENAMBAHKAN PRODUK
    // =========================================================

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'stock' => 'nullable|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan.',
            'product' => $product,
        ], 201);
    }
}
