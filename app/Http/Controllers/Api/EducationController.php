<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\EducationInterface;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    protected EducationInterface $educationRepository;

    public function __construct(EducationInterface $educationRepository)
    {
        $this->educationRepository = $educationRepository;
    }

    public function index(Request $request)
    {
        return $this->educationRepository->getAllEducation($request);
    }

    public function show($id)
    {
        return $this->educationRepository->getEducationById($id);
    }

    public function store(Request $request)
    {
        return $this->educationRepository->createEducation($request);
    }

    public function update(Request $request, $id)
    {
        return $this->educationRepository->updateEducation($request, $id);
    }

    public function destroy($id)
    {
        return $this->educationRepository->deleteEducation($id);
    }
}
