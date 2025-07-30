<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'created_at', 'is_admin')
            ->withCount('recipes') // if you have recipes relationship
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'recipes_count' => $user->recipes_count ?? 0,
                ];
            });

        return response()->json($users);
    }
}
