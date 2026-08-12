<?php

namespace App\Repositories;

use App\Interfaces\AdminAuthInterface;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminAuthRepository implements AdminAuthInterface
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid email or password credentials.'
            ], 401);
        }

        // Session login (No personal_access_tokens database table required)
        Auth::login($user);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }
        $token = bin2hex(random_bytes(32));

        return response()->json([
            'status' => true,
            'message' => 'Admin logged in successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        $user = $request->user() ?? Auth::user();

        if ($user) {
            Auth::logout();
        }

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'status' => true,
            'message' => 'Admin logged out successfully'
        ], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user() ?? Auth::user();

        if (! $user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'status' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }
}
