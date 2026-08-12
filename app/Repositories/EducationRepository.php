<?php

namespace App\Repositories;

use App\Interfaces\EducationInterface;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EducationRepository implements EducationInterface
{
    public function getAllEducation(Request $request)
    {
        $query = Education::query();

        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('institution', 'like', "%{$search}%")
                  ->orWhere('degree', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $education = $query->orderBy('start_year', 'desc')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Education records retrieved successfully',
            'data' => $education,
        ], 200);
    }

    public function getEducationById($id)
    {
        $education = Education::find($id);

        if (! $education) {
            return response()->json([
                'status' => false,
                'message' => 'Education record not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Education details retrieved successfully',
            'data' => $education,
        ], 200);
    }

    public function createEducation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'start_year' => 'required|string|max:255',
            'end_year' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'institution',
            'degree',
            'start_year',
            'end_year',
            'description',
        ]);

        $education = Education::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Education record created successfully',
            'data' => $education,
        ], 201);
    }

    public function updateEducation(Request $request, $id)
    {
        $education = Education::find($id);

        if (! $education) {
            return response()->json([
                'status' => false,
                'message' => 'Education record not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'start_year' => 'required|string|max:255',
            'end_year' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'institution',
            'degree',
            'start_year',
            'end_year',
            'description',
        ]);

        $education->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Education record updated successfully',
            'data' => $education->fresh(),
        ], 200);
    }

    public function deleteEducation($id)
    {
        $education = Education::find($id);

        if (! $education) {
            return response()->json([
                'status' => false,
                'message' => 'Education record not found',
            ], 404);
        }

        $education->delete();

        return response()->json([
            'status' => true,
            'message' => 'Education record deleted successfully',
        ], 200);
    }
}
