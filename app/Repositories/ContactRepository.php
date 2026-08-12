<?php

namespace App\Repositories;

use App\Interfaces\ContactInterface;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactRepository implements ContactInterface
{
    public function getAllContacts(Request $request)
    {
        $query = Contact::query();

        if ($request->has('search') && ! empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'read') {
                $query->where('is_read', true);
            } elseif ($request->status === 'unread') {
                $query->where('is_read', false);
            }
        }

        $contacts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Messages retrieved successfully',
            'data' => $contacts,
        ], 200);
    }

    public function getContactById($id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json([
                'status' => false,
                'message' => 'Message not found',
            ], 404);
        }

        // Auto mark as read when detail is fetched
        if (! $contact->is_read) {
            $contact->update(['is_read' => true]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Message details retrieved successfully',
            'data' => $contact->fresh(),
        ], 200);
    }

    public function createContact(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'name',
            'email',
            'subject',
            'message',
        ]);
        $data['is_read'] = false;

        $contact = Contact::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully',
            'data' => $contact,
        ], 201);
    }

    public function toggleReadStatus(Request $request, $id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json([
                'status' => false,
                'message' => 'Message not found',
            ], 404);
        }

        $isRead = $request->has('is_read')
            ? filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN)
            : ! $contact->is_read;

        $contact->update(['is_read' => $isRead]);

        return response()->json([
            'status' => true,
            'message' => 'Message status updated successfully',
            'data' => $contact->fresh(),
        ], 200);
    }

    public function deleteContact($id)
    {
        $contact = Contact::find($id);

        if (! $contact) {
            return response()->json([
                'status' => false,
                'message' => 'Message not found',
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'status' => true,
            'message' => 'Message deleted successfully',
        ], 200);
    }
}
