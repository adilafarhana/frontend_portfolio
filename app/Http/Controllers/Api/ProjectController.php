<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\ProjectInterface;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    protected ProjectInterface $projectRepository;

    public function __construct(ProjectInterface $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    public function index(Request $request)
    {
        return $this->projectRepository->getAllProjects($request);
    }

    public function show($id)
    {
        return $this->projectRepository->getProjectById($id);
    }

    public function store(Request $request)
    {
        return $this->projectRepository->createProject($request);
    }

    public function update(Request $request, $id)
    {
        return $this->projectRepository->updateProject($request, $id);
    }

    public function destroy($id)
    {
        return $this->projectRepository->deleteProject($id);
    }
}
