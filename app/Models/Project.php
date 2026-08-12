<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'technologies',
        'project_image',
        'github_url',
        'live_demo_url',
        'featured',
        'status',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'technologies' => 'array',
    ];
}
