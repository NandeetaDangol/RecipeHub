<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\KNNRecommendationService;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id(); // Authenticated user ID

        // Call your recommendation logic
        $recommended = (new KNNRecommendationService())->getRecommendations($userId);

        // Return the recommended recipes as JSON
        return response()->json($recommended);
    }
}
