<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'customer_name',
        'note',
        'total',
        'status',
    ];


    protected $casts = [
        'total' => 'integer',
    ];


    public function details(): HasMany
    {
        return $this->hasMany(
            TransactionDetail::class
        );
    }
}
