<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface ExperienceInterface
{
    public function getAllExperiences(Request $request);

    public function getExperienceById($id);

    public function createExperience(Request $request);

    public function updateExperience(Request $request, $id);

    public function deleteExperience($id);
}
