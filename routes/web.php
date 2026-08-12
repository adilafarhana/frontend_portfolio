<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\PublicPortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Portfolio API']);
});

// Public Routes
Route::prefix('api')->group(function () {
    // Consolidated User-Side API
    Route::get('/portfolio', [PublicPortfolioController::class, 'getAllPortfolioData']);

    Route::get('/about', [AboutController::class, 'index']);
    Route::get('/about/{id}', [AboutController::class, 'show']);

    Route::get('/resume', [ResumeController::class, 'getActiveResume']);
    Route::get('/resumes', [ResumeController::class, 'index']);
    Route::get('/resume/{id}', [ResumeController::class, 'show']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);

    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/skills/{id}', [SkillController::class, 'show']);

    Route::get('/experience', [ExperienceController::class, 'index']);
    Route::get('/experience/{id}', [ExperienceController::class, 'show']);

    Route::get('/education', [EducationController::class, 'index']);
    Route::get('/education/{id}', [EducationController::class, 'show']);

    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/messages', [ContactController::class, 'store']);
});

// Admin Routes
Route::prefix('api/admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);

    // Admin About Routes
    Route::get('/about', [AboutController::class, 'index']);
    Route::get('/about/{id}', [AboutController::class, 'show']);
    Route::post('/about', [AboutController::class, 'store']);
    Route::put('/about/{id}', [AboutController::class, 'update']);
    Route::post('/about/{id}', [AboutController::class, 'update']);
    Route::delete('/about/{id}', [AboutController::class, 'destroy']);

    // Admin Resume Routes
    Route::get('/resume', [ResumeController::class, 'index']);
    Route::get('/resumes', [ResumeController::class, 'index']);
    Route::get('/resume/active', [ResumeController::class, 'getActiveResume']);
    Route::get('/resume/{id}', [ResumeController::class, 'show']);
    Route::post('/resume', [ResumeController::class, 'store']);
    Route::put('/resume/{id}', [ResumeController::class, 'update']);
    Route::post('/resume/{id}', [ResumeController::class, 'update']);
    Route::patch('/resume/{id}/active', [ResumeController::class, 'toggleActive']);
    Route::delete('/resume/{id}', [ResumeController::class, 'destroy']);

    // Admin Project Routes
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::post('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);

    // Admin Skills Routes
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/skills/{id}', [SkillController::class, 'show']);
    Route::post('/skills', [SkillController::class, 'store']);
    Route::put('/skills/{id}', [SkillController::class, 'update']);
    Route::post('/skills/{id}', [SkillController::class, 'update']);
    Route::delete('/skills/{id}', [SkillController::class, 'destroy']);

    // Admin Experience Routes
    Route::get('/experience', [ExperienceController::class, 'index']);
    Route::get('/experience/{id}', [ExperienceController::class, 'show']);
    Route::post('/experience', [ExperienceController::class, 'store']);
    Route::put('/experience/{id}', [ExperienceController::class, 'update']);
    Route::post('/experience/{id}', [ExperienceController::class, 'update']);
    Route::delete('/experience/{id}', [ExperienceController::class, 'destroy']);

    // Admin Education Routes
    Route::get('/education', [EducationController::class, 'index']);
    Route::get('/education/{id}', [EducationController::class, 'show']);
    Route::post('/education', [EducationController::class, 'store']);
    Route::put('/education/{id}', [EducationController::class, 'update']);
    Route::post('/education/{id}', [EducationController::class, 'update']);
    Route::delete('/education/{id}', [EducationController::class, 'destroy']);

    // Admin Contact / Messages Routes
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/messages', [ContactController::class, 'index']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);
    Route::get('/messages/{id}', [ContactController::class, 'show']);
    Route::post('/contacts', [ContactController::class, 'store']);
    Route::post('/messages', [ContactController::class, 'store']);
    Route::patch('/contacts/{id}/read', [ContactController::class, 'toggleReadStatus']);
    Route::patch('/messages/{id}/read', [ContactController::class, 'toggleReadStatus']);
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
    Route::delete('/messages/{id}', [ContactController::class, 'destroy']);
});