<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    use HasFactory;

    protected $table = 'abouts';

    protected $fillable = [
        'full_name',
        'professional_title',
        'short_intro',
        'description',
        'profile_image',
        'location',
        'years_experience',
        'career_summary',
        'education_summary',
        'highlights',
    ];

    protected $casts = [
        'highlights' => 'array',
    ];
}
