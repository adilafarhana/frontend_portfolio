<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface ResumeInterface
{
    public function getAllResumes(Request $request);

    public function getActiveResume();

    public function getResumeById($id);

    public function createResume(Request $request);

    public function updateResume(Request $request, $id);

    public function deleteResume($id);

    public function toggleActive($id);
}
