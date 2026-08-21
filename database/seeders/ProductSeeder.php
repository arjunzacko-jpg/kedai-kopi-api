<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Kopi Susu Gula Aren',
            'category' => 'Kopi Susu',
            'description' => 'Robusta lokal, susu segar, gula aren asli',
            'price' => 18000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Es Kopi Susu Klasik',
            'category' => 'Kopi Susu',
            'description' => 'Racikan andalan, manis pas',
            'price' => 16000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Kopi Susu Vanila',
            'category' => 'Kopi Susu',
            'description' => 'Sentuhan vanila lembut',
            'price' => 17000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Piccolo Latte',
            'category' => 'Kopi Susu',
            'description' => 'Espresso ganda, susu tipis',
            'price' => 20000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Kopi Tubruk',
            'category' => 'Kopi Hitam',
            'description' => 'Racikan tradisional, diseduh kasar',
            'price' => 10000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Americano',
            'category' => 'Kopi Hitam',
            'description' => 'Espresso, air panas, simpel',
            'price' => 15000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Long Black',
            'category' => 'Kopi Hitam',
            'description' => 'Untuk yang suka pahit tegas',
            'price' => 15000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Cold Brew',
            'category' => 'Kopi Hitam',
            'description' => 'Diseduh dingin 12 jam',
            'price' => 20000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Matcha Latte',
            'category' => 'Non-Kopi',
            'description' => 'Matcha grade A, susu segar',
            'price' => 20000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Chocolate Malt',
            'category' => 'Non-Kopi',
            'description' => 'Coklat kental, malt renyah',
            'price' => 18000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Taro Latte',
            'category' => 'Non-Kopi',
            'description' => 'Manis lembut warna ungu',
            'price' => 19000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Teh Tarik',
            'category' => 'Non-Kopi',
            'description' => 'Ditarik sampai berbusa',
            'price' => 12000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Pisang Goreng Coklat',
            'category' => 'Camilan',
            'description' => 'Krispi luar, lumer dalam',
            'price' => 12000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Roti Bakar Srikaya',
            'category' => 'Camilan',
            'description' => 'Roti tebal, srikaya homemade',
            'price' => 15000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Kentang Goreng',
            'category' => 'Camilan',
            'description' => 'Disajikan dengan saus sambal',
            'price' => 15000,
            'stock' => 20,
        ]);

        Product::create([
            'name' => 'Croissant Coklat',
            'category' => 'Camilan',
            'description' => 'Berlapis, isi coklat leleh',
            'price' => 17000,
            'stock' => 20,
        ]);
    }
}
