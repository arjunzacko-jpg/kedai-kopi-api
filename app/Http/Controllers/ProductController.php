<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Menampilkan semua produk.
     */
    public function index()
    {
        return response()->json(
            Product::orderBy('id', 'asc')->get()
        );
    }

    /**
     * Debug koneksi database.
     */
    public function debugDatabase()
    {
        return response()->json([
            'connection' => config('database.default'),

            'host' => config(
                'database.connections.pgsql.host'
            ),

            'database' => config(
                'database.connections.pgsql.database'
            ),

            'username' => config(
                'database.connections.pgsql.username'
            ),

            'product_count' => Product::count(),

            'schema' => DB::select(
                'SELECT current_schema()'
            )[0]->current_schema,
        ]);
    }

    /**
     * Menambahkan produk baru.
     */
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
