<?php

namespace App\Http\Controllers\api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;


class UsersController extends Controller
{

    public function index()
    {
        $users = User::select('id', 'name', 'email', 'status', 'created_at')
            ->withCount('recipes')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status ?? 'active',
                    'joinDate' => $user->created_at->toDateString(),
                    'recipesCount' => $user->recipes_count
                ];
            });
        return $users;
    }
}
