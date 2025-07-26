<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recipe;

class AdminRecipeController extends Controller
{
    /**
     * Display a listing of all recipes.
     */
    public function index()
    {
        $recipes = Recipe::with(['user', 'category'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $recipes
        ]);
    }

    /**
     * Display a listing of top-rated recipes.
     */
    public function topRated()
    {
        $recipes = Recipe::with(['user', 'category'])
            ->orderByDesc('average_rating')
            ->take(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $recipes
        ]);
    }
}
