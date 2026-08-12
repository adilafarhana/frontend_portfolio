<?php

namespace App\Repositories;

use App\Interfaces\SkillInterface;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillRepository implements SkillInterface
{
    public function getAllSkills(Request $request)
    {
        $query = Skill::query();

        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('category') && ! empty($request->category) && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $skills = $query->orderBy('sort_order', 'asc')->orderBy('name', 'asc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Skills retrieved successfully',
            'data' => $skills,
        ], 200);
    }

    public function getSkillById($id)
    {
        $skill = Skill::find($id);

        if (! $skill) {
            return response()->json([
                'status' => false,
                'message' => 'Skill not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Skill details retrieved successfully',
            'data' => $skill,
        ], 200);
    }

    public function createSkill(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(['name', 'category', 'icon', 'sort_order']);
        $data['sort_order'] = $data['sort_order'] ?? 0;

        $skill = Skill::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Skill created successfully',
            'data' => $skill,
        ], 201);
    }

    public function updateSkill(Request $request, $id)
    {
        $skill = Skill::find($id);

        if (! $skill) {
            return response()->json([
                'status' => false,
                'message' => 'Skill not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only(['name', 'category', 'icon', 'sort_order']);
        $data['sort_order'] = $data['sort_order'] ?? $skill->sort_order;

        $skill->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Skill updated successfully',
            'data' => $skill->fresh(),
        ], 200);
    }

    public function deleteSkill($id)
    {
        $skill = Skill::find($id);

        if (! $skill) {
            return response()->json([
                'status' => false,
                'message' => 'Skill not found',
            ], 404);
        }

        $skill->delete();

        return response()->json([
            'status' => true,
            'message' => 'Skill deleted successfully',
        ], 200);
    }
}
