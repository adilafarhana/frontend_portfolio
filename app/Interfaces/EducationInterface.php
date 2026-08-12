<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface EducationInterface
{
    public function getAllEducation(Request $request);

    public function getEducationById($id);

    public function createEducation(Request $request);

    public function updateEducation(Request $request, $id);

    public function deleteEducation($id);
}
