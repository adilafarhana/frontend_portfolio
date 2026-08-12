<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Interfaces\SkillInterface;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    protected SkillInterface $skillRepository;

    public function __construct(SkillInterface $skillRepository)
    {
        $this->skillRepository = $skillRepository;
    }

    public function index(Request $request)
    {
        return $this->skillRepository->getAllSkills($request);
    }

    public function show($id)
    {
        return $this->skillRepository->getSkillById($id);
    }

    public function store(Request $request)
    {
        return $this->skillRepository->createSkill($request);
    }

    public function update(Request $request, $id)
    {
        return $this->skillRepository->updateSkill($request, $id);
    }

    public function destroy($id)
    {
        return $this->skillRepository->deleteSkill($id);
    }
}
