<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bookmark;
use App\Models\Recipe;  

class BookmarkController extends Controller
{
    // List bookmarks for the authenticated user
    public function index(Request $request)
    {
        $bookmarks = $request->user()->bookmarks()->with('recipe')->latest()->get();
        return response()->json($bookmarks);
    }

    //Store a new bookmark
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        // Check if already bookmarked
        $exists = Bookmark::where('user_id', $request->user()->id)
                          ->where('recipe_id', $validated['recipe_id'])
                          ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already bookmarked'], 200);
        }

        $bookmark = $request->user()->bookmarks()->create([
            'recipe_id' => $validated['recipe_id'],
        ]);

        return response()->json(['message' => 'Recipe bookmarked', 'data' => $bookmark], 201);
    }

    //Remove a bookmark
    public function destroy(Request $request, $id)
    {
        $bookmark = Bookmark::where('id', $id)
                            ->where('user_id', $request->user()->id)
                            ->firstOrFail();

        $bookmark->delete();

        return response()->json(['message' => 'Bookmark removed']);
    }
    // Check if a recipe is bookmarked
    public function check(Request $request, $recipeId)
    {
        $exists = Bookmark::where('user_id', $request->user()->id)
                          ->where('recipe_id', $recipeId)
                          ->exists();

        return response()->json(['is_bookmarked' => $exists]);
    }
}