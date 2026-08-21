<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // =========================================================
    // MENAMPILKAN SEMUA TRANSAKSI
    // =========================================================

    public function index()
    {
        $transactions = Transaction::with([
            'details.product'
        ])
        ->latest()
        ->get();


        return response()->json(
            $transactions
        );
    }


    // =========================================================
    // MEMBUAT TRANSAKSI
    // =========================================================

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' =>
                'required|string|max:255',

            'note' =>
                'nullable|string',

            'items' =>
                'required|array|min:1',

            'items.*.product_id' =>
                'required|exists:products,id',

            'items.*.quantity' =>
                'required|integer|min:1',
        ]);


        try {

            $transaction = DB::transaction(
                function () use ($request) {

                    $total = 0;


                    // =================================================
                    // CEK PRODUK DAN STOK
                    // =================================================

                    foreach ($request->items as $item) {

                        $product =
                            Product::findOrFail(
                                $item['product_id']
                            );


                        if (
                            $product->stock <
                            $item['quantity']
                        ) {

                            throw new \Exception(
                                "Stok {$product->name} tidak mencukupi."
                            );
                        }


                        $total +=
                            $product->price *
                            $item['quantity'];
                    }


                    // =================================================
                    // BUAT TRANSAKSI
                    // =================================================

                    $transaction =
                        Transaction::create([
                            'customer_name' =>
                                $request->customer_name,

                            'note' =>
                                $request->note,

                            'total' =>
                                $total,

                            'status' =>
                                'pending',
                        ]);


                    // =================================================
                    // SIMPAN DETAIL
                    // =================================================

                    foreach (
                        $request->items
                        as $item
                    ) {

                        $product =
                            Product::findOrFail(
                                $item['product_id']
                            );


                        $quantity =
                            $item['quantity'];


                        $subtotal =
                            $product->price *
                            $quantity;


                        TransactionDetail::create([
                            'transaction_id' =>
                                $transaction->id,

                            'product_id' =>
                                $product->id,

                            'quantity' =>
                                $quantity,

                            'price' =>
                                $product->price,

                            'subtotal' =>
                                $subtotal,
                        ]);


                        // Kurangi stok
                        $product->decrement(
                            'stock',
                            $quantity
                        );
                    }


                    return $transaction;
                }
            );


            // =========================================================
            // LOAD DETAIL TRANSAKSI
            // =========================================================

            $transaction->load([
                'details.product'
            ]);


            return response()->json([
                'success' =>
                    true,

                'message' =>
                    'Pesanan berhasil dibuat.',

                'transaction' =>
                    $transaction,

            ], 201);


        } catch (\Exception $e) {

            return response()->json([
                'success' =>
                    false,

                'message' =>
                    $e->getMessage(),

            ], 400);
        }
    }
}
