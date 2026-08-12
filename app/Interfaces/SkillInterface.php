<?php

namespace App\Interfaces;

use Illuminate\Http\Request;

interface SkillInterface
{
    public function getAllSkills(Request $request);

    public function getSkillById($id);

    public function createSkill(Request $request);

    public function updateSkill(Request $request, $id);

    public function deleteSkill($id);
}
