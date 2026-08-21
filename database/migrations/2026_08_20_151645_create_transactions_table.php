<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'transactions',
            function (Blueprint $table) {

                $table->id();

                $table->string(
                    'customer_name'
                );

                $table->text(
                    'note'
                )->nullable();

                $table->integer(
                    'total'
                );

                $table->string(
                    'status'
                )->default('pending');

                $table->timestamps();
            }
        );
    }


    public function down(): void
    {
        Schema::dropIfExists(
            'transactions'
        );
    }
};
