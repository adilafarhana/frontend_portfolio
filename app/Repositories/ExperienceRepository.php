<?php

namespace App\Repositories;

use App\Interfaces\ExperienceInterface;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExperienceRepository implements ExperienceInterface
{
    public function getAllExperiences(Request $request)
    {
        $query = Experience::query();

        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('technologies', 'like', "%{$search}%");
            });
        }

        $experiences = $query->orderBy('sort_order', 'asc')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Experiences retrieved successfully',
            'data' => $experiences,
        ], 200);
    }

    public function getExperienceById($id)
    {
        $experience = Experience::find($id);

        if (! $experience) {
            return response()->json([
                'status' => false,
                'message' => 'Experience not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Experience details retrieved successfully',
            'data' => $experience,
        ], 200);
    }

    public function createExperience(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'start_date' => 'required|string|max:255',
            'end_date' => 'nullable|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable',
            'is_current_job' => 'nullable',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'company',
            'position',
            'start_date',
            'end_date',
            'description',
            'sort_order',
        ]);

        $data['is_current_job'] = $request->has('is_current_job') ? filter_var($request->is_current_job, FILTER_VALIDATE_BOOLEAN) : false;
        $data['sort_order'] = $data['sort_order'] ?? 0;
        $data['technologies'] = $this->formatTechnologies($request->technologies);

        if ($data['is_current_job']) {
            $data['end_date'] = null;
        }

        $experience = Experience::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Experience created successfully',
            'data' => $experience,
        ], 201);
    }

    public function updateExperience(Request $request, $id)
    {
        $experience = Experience::find($id);

        if (! $experience) {
            return response()->json([
                'status' => false,
                'message' => 'Experience not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'start_date' => 'required|string|max:255',
            'end_date' => 'nullable|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable',
            'is_current_job' => 'nullable',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'company',
            'position',
            'start_date',
            'end_date',
            'description',
            'sort_order',
        ]);

        if ($request->has('is_current_job')) {
            $data['is_current_job'] = filter_var($request->is_current_job, FILTER_VALIDATE_BOOLEAN);
            if ($data['is_current_job']) {
                $data['end_date'] = null;
            }
        }

        if ($request->has('technologies')) {
            $data['technologies'] = $this->formatTechnologies($request->technologies);
        }

        $experience->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Experience updated successfully',
            'data' => $experience->fresh(),
        ], 200);
    }

    public function deleteExperience($id)
    {
        $experience = Experience::find($id);

        if (! $experience) {
            return response()->json([
                'status' => false,
                'message' => 'Experience not found',
            ], 404);
        }

        $experience->delete();

        return response()->json([
            'status' => true,
            'message' => 'Experience deleted successfully',
        ], 200);
    }

    private function formatTechnologies($techs)
    {
        if (is_array($techs)) {
            return array_values(array_filter(array_map('trim', $techs)));
        }

        if (is_string($techs) && ! empty($techs)) {
            $decoded = json_decode($techs, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded)));
            }
            return array_values(array_filter(array_map('trim', explode(',', $techs))));
        }

        return [];
    }
}
