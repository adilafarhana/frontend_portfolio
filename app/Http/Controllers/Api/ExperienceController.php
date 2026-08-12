<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\ExperienceInterface;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    protected ExperienceInterface $experienceRepository;

    public function __construct(ExperienceInterface $experienceRepository)
    {
        $this->experienceRepository = $experienceRepository;
    }

    public function index(Request $request)
    {
        return $this->experienceRepository->getAllExperiences($request);
    }

    public function show($id)
    {
        return $this->experienceRepository->getExperienceById($id);
    }

    public function store(Request $request)
    {
        return $this->experienceRepository->createExperience($request);
    }

    public function update(Request $request, $id)
    {
        return $this->experienceRepository->updateExperience($request, $id);
    }

    public function destroy($id)
    {
        return $this->experienceRepository->deleteExperience($id);
    }
}
