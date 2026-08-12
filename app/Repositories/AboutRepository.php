<?php

namespace App\Repositories;

use App\Interfaces\AboutInterface;
use App\Models\About;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class AboutRepository implements AboutInterface
{
    public function getAbout(Request $request)
    {
        $query = About::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('professional_title', 'like', "%{$search}%")
                  ->orWhere('short_intro', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        $abouts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'About details retrieved successfully',
            'data' => $abouts,
        ], 200);
    }

    public function getAboutById($id)
    {
        $about = About::find($id);

        if (!$about) {
            return response()->json([
                'status' => false,
                'message' => 'About details not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'About details retrieved successfully',
            'data' => $about,
        ], 200);
    }

    public function createAbout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'professional_title' => 'required|string|max:255',
            'short_intro' => 'nullable|string',
            'description' => 'nullable|string',
            'profile_image' => 'nullable',
            'location' => 'nullable|string|max:255',
            'years_experience' => 'nullable|string|max:100',
            'career_summary' => 'nullable|string',
            'education_summary' => 'nullable|string',
            'highlights' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'full_name',
            'professional_title',
            'short_intro',
            'description',
            'location',
            'years_experience',
            'career_summary',
            'education_summary',
        ]);

        // Process highlights
        $data['highlights'] = $this->formatHighlights($request->highlights);

        // Process profile_image (file upload or URL string)
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $uploadDir = public_path('uploads/about');
            if (!File::isDirectory($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true, true);
            }
            $file->move($uploadDir, $filename);
            $data['profile_image'] = asset('uploads/about/' . $filename);
        } elseif ($request->filled('profile_image') && is_string($request->profile_image)) {
            $data['profile_image'] = $request->profile_image;
        } else {
            $data['profile_image'] = null;
        }

        $about = About::create($data);

        return response()->json([
            'status' => true,
            'message' => 'About details created successfully',
            'data' => $about,
        ], 201);
    }

    public function updateAbout(Request $request, $id)
    {
        $about = About::find($id);

        if (!$about) {
            return response()->json([
                'status' => false,
                'message' => 'About details not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'professional_title' => 'required|string|max:255',
            'short_intro' => 'nullable|string',
            'description' => 'nullable|string',
            'profile_image' => 'nullable',
            'location' => 'nullable|string|max:255',
            'years_experience' => 'nullable|string|max:100',
            'career_summary' => 'nullable|string',
            'education_summary' => 'nullable|string',
            'highlights' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'full_name',
            'professional_title',
            'short_intro',
            'description',
            'location',
            'years_experience',
            'career_summary',
            'education_summary',
        ]);

        if ($request->has('highlights')) {
            $data['highlights'] = $this->formatHighlights($request->highlights);
        }

        // Process profile_image (file upload or URL string)
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $uploadDir = public_path('uploads/about');
            if (!File::isDirectory($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true, true);
            }
            $file->move($uploadDir, $filename);
            $data['profile_image'] = asset('uploads/about/' . $filename);
        } elseif ($request->has('profile_image') && is_string($request->profile_image)) {
            $data['profile_image'] = $request->profile_image;
        }

        $about->update($data);

        return response()->json([
            'status' => true,
            'message' => 'About details updated successfully',
            'data' => $about->fresh(),
        ], 200);
    }

    public function deleteAbout($id)
    {
        $about = About::find($id);

        if (!$about) {
            return response()->json([
                'status' => false,
                'message' => 'About details not found',
            ], 404);
        }

        $about->delete();

        return response()->json([
            'status' => true,
            'message' => 'About details deleted successfully',
        ], 200);
    }

    /**
     * Helper to format highlights into an array of strings
     */
    private function formatHighlights($highlights)
    {
        if (is_array($highlights)) {
            return array_values(array_filter(array_map('trim', $highlights)));
        }

        if (is_string($highlights) && !empty($highlights)) {
            $decoded = json_decode($highlights, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded)));
            }

            // Split by newline or comma
            $lines = preg_split("/\r\n|\n|\r|,/", $highlights);
            return array_values(array_filter(array_map('trim', $lines)));
        }

        return [];
    }
}
