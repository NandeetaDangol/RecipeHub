<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\KNNRecommendationService;

class RecommendationController extends Controller
{
    protected $knnService;

    public function __construct(KNNRecommendationService $knnService)
    {
        $this->knnService = $knnService;
    }

    public function index(Request $request)
    {
        $userId = auth()->id();

        if (!$userId) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $recommended = $this->knnService->getRecommendations($userId);

        return response()->json([
            'message' => 'Recommendations fetched successfully',
            'data' => $recommended,
        ]);
    }
}
