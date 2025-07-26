<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * Get all users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'created_at')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    /**
     * Get a single user by ID.
     */
    public function show($id)
    {
        $user = User::select('id', 'name', 'email', 'created_at')->find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Delete a user by ID.
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully.'
        ]);
    }
}
