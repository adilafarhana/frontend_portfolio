<?php

namespace App\Providers;

use App\Interfaces\AdminAuthInterface;
use App\Repositories\AdminAuthRepository;
use App\Interfaces\ProjectInterface;
use App\Repositories\ProjectRepository;
use App\Interfaces\SkillInterface;
use App\Repositories\SkillRepository;
use App\Interfaces\ExperienceInterface;
use App\Repositories\ExperienceRepository;
use App\Interfaces\EducationInterface;
use App\Repositories\EducationRepository;
use App\Interfaces\ContactInterface;
use App\Repositories\ContactRepository;
use App\Interfaces\AboutInterface;
use App\Repositories\AboutRepository;
use App\Interfaces\ResumeInterface;
use App\Repositories\ResumeRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AdminAuthInterface::class,
            AdminAuthRepository::class
        );

        $this->app->bind(
            ProjectInterface::class,
            ProjectRepository::class
        );

        $this->app->bind(
            SkillInterface::class,
            SkillRepository::class
        );

        $this->app->bind(
            ExperienceInterface::class,
            ExperienceRepository::class
        );

        $this->app->bind(
            EducationInterface::class,
            EducationRepository::class
        );

        $this->app->bind(
            ContactInterface::class,
            ContactRepository::class
        );

        $this->app->bind(
            AboutInterface::class,
            AboutRepository::class
        );

        $this->app->bind(
            ResumeInterface::class,
            ResumeRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}