<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'company',
        'position',
        'start_date',
        'end_date',
        'description',
        'technologies',
        'is_current_job',
        'sort_order',
    ];

    protected $casts = [
        'is_current_job' => 'boolean',
        'technologies' => 'array',
        'sort_order' => 'integer',
    ];
}
