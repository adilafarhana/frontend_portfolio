<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\ResumeInterface;
use Illuminate\Http\Request;

class ResumeController extends Controller
{
    protected ResumeInterface $resumeRepository;

    public function __construct(ResumeInterface $resumeRepository)
    {
        $this->resumeRepository = $resumeRepository;
    }

    public function index(Request $request)
    {
        return $this->resumeRepository->getAllResumes($request);
    }

    public function getActiveResume()
    {
        return $this->resumeRepository->getActiveResume();
    }

    public function show($id)
    {
        return $this->resumeRepository->getResumeById($id);
    }

    public function store(Request $request)
    {
        return $this->resumeRepository->createResume($request);
    }

    public function update(Request $request, $id)
    {
        return $this->resumeRepository->updateResume($request, $id);
    }

    public function destroy($id)
    {
        return $this->resumeRepository->deleteResume($id);
    }

    public function toggleActive($id)
    {
        return $this->resumeRepository->toggleActive($id);
    }
}
