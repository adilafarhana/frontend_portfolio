<?php

namespace App\Repositories;

use App\Interfaces\ProjectInterface;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProjectRepository implements ProjectInterface
{
    public function getAllProjects(Request $request)
    {
        $query = Project::query();

        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('technologies', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && ! empty($request->status) && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        $projects = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Projects retrieved successfully',
            'data' => $projects,
        ], 200);
    }

    public function getProjectById($id)
    {
        $project = null;

        if (is_numeric($id)) {
            $project = Project::find($id);
        } else {
            // Match by slug or title
            $project = Project::where('id', $id)
                ->orWhere('title', 'like', "%{$id}%")
                ->first();

            if (! $project) {
                $all = Project::all();
                foreach ($all as $p) {
                    if (\Illuminate\Support\Str::slug($p->title) === strtolower($id)) {
                        $project = $p;
                        break;
                    }
                }
            }
        }

        if (! $project) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Project details retrieved successfully',
            'data' => $project,
        ], 200);
    }

    public function createProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable',
            'project_image' => 'nullable',
            'github_url' => 'nullable|string|max:500',
            'live_demo_url' => 'nullable|string|max:500',
            'featured' => 'nullable',
            'status' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'title',
            'description',
            'github_url',
            'live_demo_url',
            'status',
        ]);

        $data['featured'] = $request->has('featured') ? filter_var($request->featured, FILTER_VALIDATE_BOOLEAN) : false;
        $data['status'] = $data['status'] ?? 'active';

        // Process technologies
        $data['technologies'] = $this->formatTechnologies($request->technologies);

        // Process project_image (file or string URL)
        if ($request->hasFile('project_image')) {
            $file = $request->file('project_image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/projects'), $filename);
            $data['project_image'] = asset('uploads/projects/' . $filename);
        } elseif ($request->filled('project_image') && is_string($request->project_image)) {
            $data['project_image'] = $request->project_image;
        } else {
            $data['project_image'] = null;
        }

        $project = Project::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);
    }

    public function updateProject(Request $request, $id)
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'technologies' => 'nullable',
            'project_image' => 'nullable',
            'github_url' => 'nullable|string|max:500',
            'live_demo_url' => 'nullable|string|max:500',
            'featured' => 'nullable',
            'status' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'title',
            'description',
            'github_url',
            'live_demo_url',
            'status',
        ]);

        if ($request->has('featured')) {
            $data['featured'] = filter_var($request->featured, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('technologies')) {
            $data['technologies'] = $this->formatTechnologies($request->technologies);
        }

        // Process project_image (file upload or URL string)
        if ($request->hasFile('project_image')) {
            $file = $request->file('project_image');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/projects'), $filename);
            $data['project_image'] = asset('uploads/projects/' . $filename);
        } elseif ($request->has('project_image') && is_string($request->project_image)) {
            $data['project_image'] = $request->project_image;
        }

        $project->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Project updated successfully',
            'data' => $project->fresh(),
        ], 200);
    }

    public function deleteProject($id)
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json([
                'status' => false,
                'message' => 'Project not found',
            ], 404);
        }

        $project->delete();

        return response()->json([
            'status' => true,
            'message' => 'Project deleted successfully',
        ], 200);
    }

    /**
     * Helper to format technologies into array
     */
    private function formatTechnologies($techs)
    {
        if (is_array($techs)) {
            return array_values(array_filter(array_map('trim', $techs)));
        }

        if (is_string($techs) && ! empty($techs)) {
            // Check if it's json string
            $decoded = json_decode($techs, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded)));
            }
            // Otherwise split by comma
            return array_values(array_filter(array_map('trim', explode(',', $techs))));
        }

        return [];
    }
}
