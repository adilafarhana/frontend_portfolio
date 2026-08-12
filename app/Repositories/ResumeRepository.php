<?php

namespace App\Repositories;

use App\Interfaces\ResumeInterface;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class ResumeRepository implements ResumeInterface
{
    public function getAllResumes(Request $request)
    {
        $query = Resume::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            $isActive = $request->status === 'active';
            $query->where('is_active', $isActive);
        }

        $resumes = $query->orderBy('is_active', 'desc')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Resumes retrieved successfully',
            'data' => $resumes,
        ], 200);
    }

    public function getActiveResume()
    {
        $resume = Resume::where('is_active', true)->orderBy('updated_at', 'desc')->first();

        if (!$resume) {
            $resume = Resume::orderBy('created_at', 'desc')->first();
        }

        if (!$resume) {
            return response()->json([
                'status' => false,
                'message' => 'No active resume found',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Active resume retrieved successfully',
            'data' => $resume,
        ], 200);
    }

    public function getResumeById($id)
    {
        $resume = Resume::find($id);

        if (!$resume) {
            return response()->json([
                'status' => false,
                'message' => 'Resume not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Resume details retrieved successfully',
            'data' => $resume,
        ], 200);
    }

    public function createResume(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'resume_file' => 'nullable',
            'file_path' => 'nullable',
            'is_active' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        $isActive = $request->has('is_active') ? filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN) : true;
        $data['is_active'] = $isActive;

        // If active, deactivate others
        if ($isActive) {
            Resume::where('is_active', true)->update(['is_active' => false]);
        }

        // Process File Upload
        if ($request->hasFile('resume_file')) {
            $file = $request->file('resume_file');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $mimeType = $file->getClientMimeType();
            $fileSizeBytes = $file->getSize();

            $filename = time() . '_' . uniqid() . '.' . $extension;
            $uploadDir = public_path('uploads/resumes');
            if (!File::isDirectory($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true, true);
            }
            $file->move($uploadDir, $filename);

            $data['file_path'] = asset('uploads/resumes/' . $filename);
            $data['file_name'] = $originalName;
            $data['file_size'] = $this->formatFileSize($fileSizeBytes);
            $data['file_type'] = $mimeType ?: $extension;
        } elseif ($request->filled('file_path') && is_string($request->file_path)) {
            $data['file_path'] = $request->file_path;
            $data['file_name'] = basename($request->file_path);
            $data['file_size'] = 'Remote';
            $data['file_type'] = 'application/pdf';
        } else {
            return response()->json([
                'status' => false,
                'message' => 'Please provide a resume document (PDF / Word) or URL.',
                'errors' => ['resume_file' => ['Resume file or URL is required.']],
            ], 422);
        }

        $resume = Resume::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Resume uploaded and created successfully',
            'data' => $resume,
        ], 201);
    }

    public function updateResume(Request $request, $id)
    {
        $resume = Resume::find($id);

        if (!$resume) {
            return response()->json([
                'status' => false,
                'message' => 'Resume not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'resume_file' => 'nullable',
            'file_path' => 'nullable',
            'is_active' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
        ];

        if ($request->has('is_active')) {
            $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
            $data['is_active'] = $isActive;
            if ($isActive) {
                Resume::where('id', '!=', $id)->where('is_active', true)->update(['is_active' => false]);
            }
        }

        // Process File Upload
        if ($request->hasFile('resume_file')) {
            $file = $request->file('resume_file');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $mimeType = $file->getClientMimeType();
            $fileSizeBytes = $file->getSize();

            $filename = time() . '_' . uniqid() . '.' . $extension;
            $uploadDir = public_path('uploads/resumes');
            if (!File::isDirectory($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true, true);
            }
            $file->move($uploadDir, $filename);

            $data['file_path'] = asset('uploads/resumes/' . $filename);
            $data['file_name'] = $originalName;
            $data['file_size'] = $this->formatFileSize($fileSizeBytes);
            $data['file_type'] = $mimeType ?: $extension;
        } elseif ($request->filled('file_path') && is_string($request->file_path)) {
            $data['file_path'] = $request->file_path;
            $data['file_name'] = basename($request->file_path);
        }

        $resume->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Resume updated successfully',
            'data' => $resume->fresh(),
        ], 200);
    }

    public function deleteResume($id)
    {
        $resume = Resume::find($id);

        if (!$resume) {
            return response()->json([
                'status' => false,
                'message' => 'Resume not found',
            ], 404);
        }

        $resume->delete();

        return response()->json([
            'status' => true,
            'message' => 'Resume deleted successfully',
        ], 200);
    }

    public function toggleActive($id)
    {
        $resume = Resume::find($id);

        if (!$resume) {
            return response()->json([
                'status' => false,
                'message' => 'Resume not found',
            ], 404);
        }

        $newStatus = !$resume->is_active;

        if ($newStatus) {
            Resume::where('id', '!=', $id)->update(['is_active' => false]);
        }

        $resume->update(['is_active' => $newStatus]);

        return response()->json([
            'status' => true,
            'message' => $newStatus ? 'Resume marked as active' : 'Resume deactivated',
            'data' => $resume->fresh(),
        ], 200);
    }

    private function formatFileSize($bytes)
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 1) . ' KB';
        } elseif ($bytes > 1) {
            return $bytes . ' bytes';
        } elseif ($bytes == 1) {
            return $bytes . ' byte';
        } else {
            return '0 bytes';
        }
    }
}
