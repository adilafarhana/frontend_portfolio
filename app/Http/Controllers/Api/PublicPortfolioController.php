<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\About;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Education;
use App\Models\Resume;
use Illuminate\Http\Request;

class PublicPortfolioController extends Controller
{
    /**
     * Get all public portfolio data in a single optimized payload
     */
    public function getAllPortfolioData(Request $request)
    {
        $about = About::orderBy('created_at', 'desc')->first();
        $projects = Project::orderBy('created_at', 'desc')->get();
        $skills = Skill::all();
        $experiences = Experience::orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->get();
        $educations = Education::orderBy('start_year', 'desc')->get();
        $resume = Resume::where('is_active', true)->orderBy('updated_at', 'desc')->first()
            ?: Resume::orderBy('created_at', 'desc')->first();

        return response()->json([
            'status' => true,
            'message' => 'Complete portfolio data retrieved successfully',
            'data' => [
                'about' => $about,
                'projects' => $projects,
                'skills' => $skills,
                'experience' => $experiences,
                'education' => $educations,
                'resume' => $resume,
                'stats' => [
                    'total_projects' => $projects->count(),
                    'total_skills' => $skills->count(),
                    'years_experience' => $about ? $about->years_experience : null,
                ],
            ],
        ], 200);
    }
}
