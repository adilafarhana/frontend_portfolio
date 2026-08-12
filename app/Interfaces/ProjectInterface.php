<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface ProjectInterface
{
    public function getAllProjects(Request $request);

    public function getProjectById($id);

    public function createProject(Request $request);

    public function updateProject(Request $request, $id);

    public function deleteProject($id);
}
