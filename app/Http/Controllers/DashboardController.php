<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum'); // Sanctum auth middleware for API
    }

    public function index()
    {
        $user = Auth::user();

        $dashboardData = [
            'welcomeMessage' => "Welcome back, {$user->name}!",
            'recentOrdersCount' => 5, // example data
            'notifications' => [
                'Your profile is 80% complete.',
                'New recipes added this week!',
            ],
        ];

        return response()->json([
            'user' => $user,
            'dashboard' => $dashboardData,
        ]);
    }
}
